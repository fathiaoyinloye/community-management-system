package com.communityplatform.payment.data.model;


import com.communityplatform.common.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "payments")
public class Payment extends BaseEntity {

    @Column( nullable = false)
    private UUID houseLevyId;

    private UUID verifiedBy;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    private String paymentReference;

    private String proofOfPaymentUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private String remarks;

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    private LocalDateTime verifiedDate;
}
