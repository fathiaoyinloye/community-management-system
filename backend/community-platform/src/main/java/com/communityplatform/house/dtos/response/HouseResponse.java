package com.communityplatform.house.dtos.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record HouseResponse(
        UUID id,
        UUID communityId,
        UUID residentId,
        String houseNumber,
        String street,
        LocalDateTime createdAt
) {
}