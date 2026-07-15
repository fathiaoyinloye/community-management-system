package com.communityplatform.payment.dtos.response;

import com.communityplatform.payment.data.model.PaymentStatus;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        UUID houseLevyId,
        BigDecimal amount,
        String paymentReference,
        PaymentStatus status,
        String remarks,
        LocalDateTime paymentDate,
        LocalDateTime verifiedDate
) {
}
