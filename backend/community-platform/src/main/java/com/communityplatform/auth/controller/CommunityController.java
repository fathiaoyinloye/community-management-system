package com.communityplatform.auth.controller;

import com.communityplatform.auth.dto.request.AssignCommunityAdminRequest;
import com.communityplatform.auth.dto.request.CreateCommunityRequest;
import com.communityplatform.auth.dto.response.CommunityResponse;
import com.communityplatform.auth.dto.response.UserActivationResponse;
import com.communityplatform.auth.services.interfaces.CommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/communities")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @PostMapping
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<CommunityResponse> createCommunity(@Valid @RequestBody CreateCommunityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(communityService.createCommunity(request));
    }

    @PostMapping("/{communityId}/assign-admin")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<UserActivationResponse> assignCommunityAdministrator(
            @PathVariable UUID communityId,
            @Valid @RequestBody AssignCommunityAdminRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(communityService.assignCommunityAdministrator(communityId, request));
    }
}