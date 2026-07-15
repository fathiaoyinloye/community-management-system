package com.communityplatform.payment.service.interfaces;


import com.communityplatform.payment.dtos.requests.RejectPaymentRequest;
import com.communityplatform.payment.dtos.requests.UploadPaymentRequest;
import com.communityplatform.payment.dtos.response.PaymentResponse;
import com.communityplatform.payment.dtos.response.ReceiptResponse;

import java.util.UUID;

public interface PaymentService {

    PaymentResponse uploadProofOfPayment(UploadPaymentRequest request);

    ReceiptResponse verifyPayment(UUID paymentId);

    PaymentResponse rejectPayment(UUID paymentId, RejectPaymentRequest request);

    ReceiptResponse getReceipt(UUID paymentId);
}