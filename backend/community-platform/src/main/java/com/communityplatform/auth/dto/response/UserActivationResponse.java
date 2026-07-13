package com.communityplatform.auth.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserActivationResponse(
        UUID userId,
        String email,
        String username,
        String role,
        String activationLink,
        LocalDateTime expiresAt
) {
}