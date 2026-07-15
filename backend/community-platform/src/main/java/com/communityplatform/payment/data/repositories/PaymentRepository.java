package com.communityplatform.payment.data.repositories;

import com.communityplatform.payment.data.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
}
