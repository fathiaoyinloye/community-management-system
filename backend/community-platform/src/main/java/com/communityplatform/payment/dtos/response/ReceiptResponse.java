package com.communityplatform.payment.dtos.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReceiptResponse(

            UUID id,
            String receiptNumber,
            String communityName,
            String houseNumber,
            String residentName,
            String levyName,
            BigDecimal amount,
            LocalDateTime datePaid
    ) {

}
