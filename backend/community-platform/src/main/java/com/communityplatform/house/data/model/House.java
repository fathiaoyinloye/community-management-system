package com.communityplatform.house.data.model;


import com.communityplatform.common.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "houses")
public class House extends BaseEntity {

    @Column(nullable = false)
    private UUID communityId;

    private UUID residentId;

    @Column(nullable = false)
    private String houseNumber;

    @Column(nullable = false)
    private String street;
}