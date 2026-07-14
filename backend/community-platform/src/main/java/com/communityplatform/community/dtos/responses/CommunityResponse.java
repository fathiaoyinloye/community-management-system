package com.communityplatform.community.dtos.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommunityResponse(
        UUID id,
        String name,
        String type,
        String address,
        String lga,
        String state,
        String phone,
        String email,
        String description,
        LocalDateTime createdAt
) {
}
