package com.communityplatform.payment.dtos.requests;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class UploadPaymentRequest {
    @NotNull(message = "House levy is required")
    private UUID houseLevyId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotBlank(message = "Payment reference is required")
    private String paymentReference;

    @NotBlank(message = "Proof of payment is required")
    private String proofOfPaymentUrl;
}
