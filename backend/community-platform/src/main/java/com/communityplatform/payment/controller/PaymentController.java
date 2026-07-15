package com.communityplatform.payment.controller;

import com.communityplatform.payment.dtos.requests.RejectPaymentRequest;
import com.communityplatform.payment.dtos.requests.UploadPaymentRequest;
import com.communityplatform.payment.dtos.response.PaymentResponse;
import com.communityplatform.payment.dtos.response.ReceiptResponse;
import com.communityplatform.payment.service.interfaces.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<PaymentResponse> uploadProofOfPayment(@Valid @RequestBody UploadPaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.uploadProofOfPayment(request));
    }

    @PostMapping("/{paymentId}/verify")
    @PreAuthorize("hasRole('COMMUNITY_STAFF')")
    public ResponseEntity<ReceiptResponse> verifyPayment(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.verifyPayment(paymentId));
    }

    @PostMapping("/{paymentId}/reject")
    @PreAuthorize("hasRole('COMMUNITY_STAFF')")
    public ResponseEntity<PaymentResponse> rejectPayment(
            @PathVariable UUID paymentId,
            @Valid @RequestBody RejectPaymentRequest request
    ) {
        return ResponseEntity.ok(paymentService.rejectPayment(paymentId, request));
    }

    @GetMapping("/{paymentId}/receipt")
    @PreAuthorize("hasRole('RESIDENT') or hasRole('COMMUNITY_STAFF')")
    public ResponseEntity<ReceiptResponse> downloadReceipt(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.getReceipt(paymentId));
    }
}