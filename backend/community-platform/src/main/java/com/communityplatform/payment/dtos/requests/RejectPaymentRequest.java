package com.communityplatform.payment.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectPaymentRequest {
    @NotBlank(message = "Reason for rejection is required")
    private String remarks;
}
