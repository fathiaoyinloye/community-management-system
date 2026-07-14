package com.communityplatform.auth.mapper;

import com.communityplatform.auth.data.model.User;
import com.communityplatform.auth.dto.request.CreatePendingUserRequest;
import com.communityplatform.auth.dto.response.UserActivationResponse;

import java.time.LocalDateTime;
import java.util.UUID;

public class AuthMapper {
    private AuthMapper() {}

    public static User mapPendingUserToUser(CreatePendingUserRequest request, String username, Long expiryHours,String activationToken ) {


        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(username)
                .email(request.getEmail())
                .phoneNumber(request.getPhone())
                .role(request.getRole())
                .communityId(request.getCommunityId())
                .password(null)
                .enabled(false)
                .accountSetupCompleted(false)
                .activationToken(activationToken)
                .activationTokenExpiry(LocalDateTime.now().plusHours(expiryHours))
                .build();
        return user;
    }

    public static UserActivationResponse mapUserActivationResponse(User user, String activationLink ) {
        return new UserActivationResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole().name(),
                activationLink,
                user.getActivationTokenExpiry()
        );
    }




}
