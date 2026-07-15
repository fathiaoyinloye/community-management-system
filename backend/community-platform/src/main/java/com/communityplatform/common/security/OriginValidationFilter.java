package com.communityplatform.common.security;



import com.communityplatform.common.exception.ApiError;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;


import java.io.IOException;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class OriginValidationFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    @Value("${app.frontend-url}")
    private String allowedOrigin;

    private static final Set<String> STATE_CHANGING_METHODS = Set.of(
            HttpMethod.POST.name(),
            HttpMethod.PUT.name(),
            HttpMethod.PATCH.name(),
            HttpMethod.DELETE.name()
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if (!STATE_CHANGING_METHODS.contains(request.getMethod())) {
            filterChain.doFilter(request, response); // GET/OPTIONS pass through untouched
            return;
        }

        String origin = request.getHeader("Origin");

        if (origin != null && !origin.equals(allowedOrigin)) {
            log.warn("Blocked request with mismatched Origin: {} (expected {})", origin, allowedOrigin);
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType("application/json");
            ApiError error = new ApiError(HttpStatus.FORBIDDEN.value(), "Request origin not allowed");
            response.getWriter().write(objectMapper.writeValueAsString(error));
            return;
        }

        filterChain.doFilter(request, response);
    }
}