package com.communityplatform.auth.dto.request;

import com.communityplatform.auth.data.model.Role;
import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

@Getter
@Builder
public class CreatePendingUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Role role;
    private UUID communityId;
}