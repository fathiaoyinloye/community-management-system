package com.communityplatform.auth.dto.response;

import java.util.UUID;

public record LoginResponse(
        UUID id,
        String username,
        String firstName,
        String lastName,
        String role
) {
}