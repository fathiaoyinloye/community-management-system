package com.communityplatform.payment.service.implementations;

import com.communityplatform.auth.data.model.User;
import com.communityplatform.auth.data.repositories.UserRepository;
import com.communityplatform.common.exception.ResourceNotFoundException;
import com.communityplatform.community.data.repository.CommunityRepository;
import com.communityplatform.house.data.model.House;
import com.communityplatform.house.data.repositories.HouseRepository;
import com.communityplatform.levy.model.data.HouseLevy;
import com.communityplatform.levy.model.data.HouseLevyStatus;
import com.communityplatform.levy.model.data.LevyType;
import com.communityplatform.levy.model.repository.HouseLevyRepository;
import com.communityplatform.levy.model.repository.LevyTypeRepository;
import com.communityplatform.notification.service.interfaces.NotificationService;
import com.communityplatform.payment.data.model.Payment;
import com.communityplatform.payment.data.model.PaymentStatus;
import com.communityplatform.payment.data.model.Receipt;
import com.communityplatform.payment.data.repositories.PaymentRepository;
import com.communityplatform.payment.data.repositories.ReceiptRepository;
import com.communityplatform.payment.dtos.requests.RejectPaymentRequest;
import com.communityplatform.payment.dtos.requests.UploadPaymentRequest;
import com.communityplatform.payment.dtos.response.PaymentResponse;
import com.communityplatform.payment.dtos.response.ReceiptResponse;
import com.communityplatform.payment.mapper.PaymentMapper;
import com.communityplatform.payment.service.interfaces.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImplementation implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReceiptRepository receiptRepository;
    private final HouseLevyRepository houseLevyRepository;
    private final HouseRepository houseRepository;
    private final LevyTypeRepository levyTypeRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public PaymentResponse uploadProofOfPayment(UploadPaymentRequest request) {
        User currentResident = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();

        assert currentResident != null;
        House house = houseRepository.findByResidentId(currentResident.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No house is registered to this resident"));

        HouseLevy houseLevy = houseLevyRepository.findById(request.getHouseLevyId())
                .orElseThrow(() -> new ResourceNotFoundException("Levy not found: " + request.getHouseLevyId()));

        if (!houseLevy.getHouseId().equals(house.getId())) {
            throw new IllegalStateException("This levy does not belong to your house");
        }

        Payment payment = Payment.builder()
                .houseLevyId(houseLevy.getId())
                .amount(request.getAmount())
                .paymentReference(request.getPaymentReference())
                .proofOfPaymentUrl(request.getProofOfPaymentUrl())
                .status(PaymentStatus.PENDING_REVIEW)
                .paymentDate(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);
        log.info("Payment uploaded: id={} houseLevy={} amount={}", payment.getId(), houseLevy.getId(), payment.getAmount());

        return PaymentMapper.toResponse(payment);
    }

    @Override
    @Transactional
    public ReceiptResponse verifyPayment(UUID paymentId) {
        User currentStaff = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));

        if (payment.getStatus() != PaymentStatus.PENDING_REVIEW) {
            throw new IllegalStateException("This payment has already been processed");
        }

        HouseLevy houseLevy = houseLevyRepository.findById(payment.getHouseLevyId())
                .orElseThrow(() -> new ResourceNotFoundException("Levy not found: " + payment.getHouseLevyId()));

        BigDecimal newBalance = houseLevy.getBalance().subtract(payment.getAmount());
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            newBalance = BigDecimal.ZERO; // guard against overpayment pushing balance negative
        }
        houseLevy.setBalance(newBalance);
        houseLevy.setStatus(newBalance.compareTo(BigDecimal.ZERO) == 0 ? HouseLevyStatus.PAID : HouseLevyStatus.PARTIALLY_PAID);
        houseLevyRepository.save(houseLevy);

        payment.setStatus(PaymentStatus.VERIFIED);
        payment.setVerifiedBy(currentStaff.getId());
        payment.setVerifiedDate(LocalDateTime.now());
        paymentRepository.save(payment);

        Receipt receipt = generateReceipt(payment, houseLevy);

        House house = houseRepository.findById(houseLevy.getHouseId()).orElseThrow();
        User resident = house.getResidentId() != null ? userRepository.findById(house.getResidentId()).orElse(null) : null;

        if (resident != null) {
            String contact = resident.getEmail() != null ? resident.getEmail() : resident.getPhoneNumber();
            notificationService.notifyResident(contact,
                    "Your payment of " + payment.getAmount() + " has been verified. Receipt: " + receipt.getReceiptNumber());
        }

        log.info("Payment verified: id={} newBalance={} receipt={}", payment.getId(), newBalance, receipt.getReceiptNumber());
        return PaymentMapper.toResponse(receipt);
    }

    @Override
    public PaymentResponse rejectPayment(UUID paymentId, RejectPaymentRequest request) {
        User currentStaff = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));

        if (payment.getStatus() != PaymentStatus.PENDING_REVIEW) {
            throw new IllegalStateException("This payment has already been processed");
        }

        payment.setStatus(PaymentStatus.REJECTED);
        payment.setRemarks(request.getRemarks());
        payment.setVerifiedBy(currentStaff.getId());
        payment.setVerifiedDate(LocalDateTime.now());
        paymentRepository.save(payment);

        HouseLevy houseLevy = houseLevyRepository.findById(payment.getHouseLevyId()).orElseThrow();
        House house = houseRepository.findById(houseLevy.getHouseId()).orElseThrow();
        User resident = house.getResidentId() != null ? userRepository.findById(house.getResidentId()).orElse(null) : null;

        if (resident != null) {
            String contact = resident.getEmail() != null ? resident.getEmail() : resident.getPhoneNumber();
            notificationService.notifyResident(contact,
                    "Your payment was rejected. Reason: " + request.getRemarks());
        }

        log.info("Payment rejected: id={} reason={}", payment.getId(), request.getRemarks());
        return PaymentMapper.toResponse(payment);
    }

    @Override
    public ReceiptResponse getReceipt(UUID paymentId) {
        Receipt receipt = receiptRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("No receipt found for this payment"));

        return PaymentMapper.toResponse(receipt);
    }

    private Receipt generateReceipt(Payment payment, HouseLevy houseLevy) {
        House house = houseRepository.findById(houseLevy.getHouseId()).orElseThrow();
        LevyType levyType = levyTypeRepository.findById(houseLevy.getLevyTypeId()).orElseThrow();
        String communityName = communityRepository.findById(house.getCommunityId())
                .map(c -> c.getName()).orElse("Unknown Community");
        String residentName = house.getResidentId() != null
                ? userRepository.findById(house.getResidentId())
                .map(u -> u.getFirstName() + " " + u.getLastName())
                .orElse("Unknown Resident")
                : "Unknown Resident";

        Receipt receipt = Receipt.builder()
                .receiptNumber("RCT-" + System.currentTimeMillis())
                .paymentId(payment.getId())
                .communityName(communityName)
                .houseNumber(house.getHouseNumber())
                .residentName(residentName)
                .levyName(levyType.getName())
                .amount(payment.getAmount())
                .datePaid(payment.getPaymentDate())
                .build();

        return receiptRepository.save(receipt);
    }
}