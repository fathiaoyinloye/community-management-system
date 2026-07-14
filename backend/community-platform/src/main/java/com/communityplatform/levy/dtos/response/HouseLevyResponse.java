package com.communityplatform.levy.dtos.response;

import com.communityplatform.levy.model.data.HouseLevyStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record HouseLevyResponse(
        UUID id,
        String levyName,
        BigDecimal amount,
        BigDecimal balance,
        LocalDate dueDate,
        HouseLevyStatus status
) {
}