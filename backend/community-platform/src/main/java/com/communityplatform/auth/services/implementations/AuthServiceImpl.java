package com.communityplatform.auth.services.implementations;

import com.communityplatform.auth.data.model.User;
import com.communityplatform.auth.dto.request.LoginRequest;
import com.communityplatform.auth.dto.response.LoginResponse;
import com.communityplatform.auth.security.JwtService;
import com.communityplatform.auth.services.interfaces.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    @Value("${app.cookie.secure:true}")
    private boolean cookieSecure;

    @Override
    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        log.info("Login attempt for username={}", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        String token = jwtService.generateToken(user);
        attachCookie(response, token, expirationMs / 1000);
        log.info("Login successful for userId={} role={}", user.getId(), user.getRole());

        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name()
        );
    }

    @Override
    public void logout(HttpServletResponse response) {
        attachCookie(response, "", 0); // Max-Age=0 clears the cookie immediately
    }

    private void attachCookie(HttpServletResponse response, String token, long maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }
}