package com.communityplatform.payment.mapper;


import com.communityplatform.payment.data.model.Payment;
import com.communityplatform.payment.data.model.Receipt;
import com.communityplatform.payment.dtos.response.PaymentResponse;
import com.communityplatform.payment.dtos.response.ReceiptResponse;

public class PaymentMapper {

    private PaymentMapper() {}

    public static PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getHouseLevyId(),
                payment.getAmount(),
                payment.getPaymentReference(),
                payment.getStatus(),
                payment.getRemarks(),
                payment.getPaymentDate(),
                payment.getVerifiedDate()
        );
    }

    public static ReceiptResponse toResponse(Receipt receipt) {
        return new ReceiptResponse(
                receipt.getId(),
                receipt.getReceiptNumber(),
                receipt.getCommunityName(),
                receipt.getHouseNumber(),
                receipt.getResidentName(),
                receipt.getLevyName(),
                receipt.getAmount(),
                receipt.getDatePaid()
        );
    }
}