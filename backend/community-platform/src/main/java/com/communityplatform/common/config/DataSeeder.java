package com.communityplatform.common.config;

import com.communityplatform.auth.data.model.Role;
import com.communityplatform.auth.data.model.User;
import com.communityplatform.auth.data.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.existsByUsername("admin")) {
            return; // already seeded, don't duplicate on every restart
        }

        User platformAdmin = User.builder()
                .firstName("Platform")
                .lastName("Admin")
                .username("admin")
                .email("admin@communityplatform.com")
                .password(passwordEncoder.encode("Admin@123"))
                .phoneNumber("08000000000")
                .role(Role.PLATFORM_ADMIN)
                .accountSetupCompleted(true)
                .enabled(true)
                .build();

        userRepository.save(platformAdmin);
        System.out.println("Seeded Platform Administrator — username: admin / password: Admin@123");
    }
}