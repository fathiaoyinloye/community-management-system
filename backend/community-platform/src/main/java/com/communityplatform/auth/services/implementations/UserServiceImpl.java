package com.communityplatform.auth.services.implementations;

import com.communityplatform.auth.data.model.Role;
import com.communityplatform.auth.data.model.User;
import com.communityplatform.auth.data.repositories.UserRepository;
import com.communityplatform.auth.dto.request.CompleteAccountSetupRequest;
import com.communityplatform.auth.dto.request.CreatePendingUserRequest;
import com.communityplatform.auth.dto.response.AccountActivatedResponse;
import com.communityplatform.auth.dto.response.UserActivationResponse;
import com.communityplatform.auth.mapper.AuthMapper;
import com.communityplatform.auth.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
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




    private final PasswordEncoder passwordEncoder;

    @Override
    public UserActivationResponse createPendingUser(CreatePendingUserRequest request) {
        if (StringUtils.hasText(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("A user with this email already exists");
        }

        String username = generateUniqueUsername(request.getFirstName(), request.getLastName());
        String activationToken = UUID.randomUUID().toString();
        User  user =AuthMapper.mapPendingUserToUser(request, username, expiryHours, activationToken);
        userRepository.save(user);
        log.info("Pending user created: id={} username={} role={}", user.getId(), username, request.getRole());

        String activationLink = frontendUrl + "/activate-account?token=" + activationToken;

        if (StringUtils.hasText(request.getEmail())) {
            log.info("MOCK EMAIL to {}: You've been invited as {}. Activation link: {}",
                    request.getEmail(), request.getRole(), activationLink);
        } else {
            log.info("MOCK SMS to {}: You've been invited as {}. Activation link: {}",
                    request.getPhone(), request.getRole(), activationLink);
        }

        return AuthMapper.mapUserActivationResponse(user, activationLink);
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



    @Override
    public AccountActivatedResponse completeAccountSetup(CompleteAccountSetupRequest request) {
        User user = userRepository.findByActivationToken(request.getToken())
                .orElseThrow(() -> new IllegalStateException("Invalid or already-used activation token"));

        if (user.getActivationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Activation token has expired — please request a new invitation");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalStateException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user.setAccountSetupCompleted(true);
        user.setActivationToken(null);
        user.setActivationTokenExpiry(null);

        userRepository.save(user);
        log.info("Account activated: id={} username={} role={}", user.getId(), user.getUsername(), user.getRole());

        return new AccountActivatedResponse(user.getUsername(), "Account activated successfully. You may now log in.");
    }
}

