package com.communityplatform.auth.services.implementations;

import com.communityplatform.auth.data.model.Role;
import com.communityplatform.auth.data.model.User;
import com.communityplatform.auth.data.repositories.UserRepository;
import com.communityplatform.auth.dto.request.CreatePendingUserRequest;
import com.communityplatform.auth.dto.response.UserActivationResponse;
import com.communityplatform.auth.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.UUID;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.invitation.expiry-hours:24}")
    private long expiryHours;

    @Override
    public UserActivationResponse createPendingUser(CreatePendingUserRequest request) {
        if (StringUtils.hasText(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("A user with this email already exists");
        }

        String username = generateUniqueUsername(request.getFirstName(), request.getLastName());
        String activationToken = UUID.randomUUID().toString();

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

        userRepository.save(user);
        log.info("Pending user created: id={} username={} role={}", user.getId(), username, request.getRole());

        String activationLink = frontendUrl + "/activate-account?token=" + activationToken;

        // Email sending mocked for demo — logging the link instead of an actual send.
        // If email is absent, this would be an SMS in a real implementation (phone is guaranteed present).
        if (StringUtils.hasText(request.getEmail())) {
            log.info("MOCK EMAIL to {}: You've been invited as {}. Activation link: {}",
                    request.getEmail(), request.getRole(), activationLink);
        } else {
            log.info("MOCK SMS to {}: You've been invited as {}. Activation link: {}",
                    request.getPhone(), request.getRole(), activationLink);
        }

        return new UserActivationResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole().name(),
                activationLink,
                user.getActivationTokenExpiry()
        );
    }

    private String generateUniqueUsername(String firstName, String lastName) {
        String base = (firstName + "." + lastName).toLowerCase().replaceAll("\\s+", "");
        String candidate = base;
        int suffix = 1;

        while (userRepository.existsByUsername(candidate)) {
            suffix++;
            candidate = base + suffix;
        }

        return candidate;
    }
}

