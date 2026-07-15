package com.communityplatform.payment.data.model;


import com.communityplatform.common.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "receipts")
public class Receipt extends BaseEntity {

    @Column( nullable = false, unique = true)
    private String receiptNumber;

    @Column(nullable = false)
    private UUID paymentId;

    @Column( nullable = false)
    private String communityName;

    @Column( nullable = false)
    private String houseNumber;

    @Column(nullable = false)
    private String residentName;

    @Column( nullable = false)
    private String levyName;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column( nullable = false)
    private LocalDateTime datePaid;
}