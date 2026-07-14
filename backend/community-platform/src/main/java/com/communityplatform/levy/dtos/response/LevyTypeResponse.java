package com.communityplatform.levy.dtos.response;


import com.communityplatform.levy.model.data.Frequency;

import java.math.BigDecimal;
import java.util.UUID;

public record LevyTypeResponse(
        UUID id,
        String name,
        BigDecimal amount,
        Frequency frequency,
        int housesBilled
) {
}
