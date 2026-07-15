package com.communityplatform.payment.data.repositories;

import com.communityplatform.payment.data.model.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReceiptRepository extends JpaRepository<Receipt, UUID> {

    Optional<Receipt> findByPaymentId(UUID paymentId);

    List<Receipt> findByResidentNameOrderByDatePaidDesc(String residentName);
}
