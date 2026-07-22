package com.communityplatform.community.controller;

import com.communityplatform.community.dtos.request.AssignCommunityAdminRequest;
import com.communityplatform.community.dtos.request.CreateCommunityRequest;
import com.communityplatform.community.dtos.request.InviteStaffRequest;
import com.communityplatform.community.dtos.responses.CommunityResponse;
import com.communityplatform.auth.dto.response.UserActivationResponse;
import com.communityplatform.community.services.interfaces.CommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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


    @PostMapping("/staff/invite")
    @PreAuthorize("hasRole('COMMUNITY_ADMIN')")
    public ResponseEntity<UserActivationResponse> inviteStaff(@Valid @RequestBody InviteStaffRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(communityService.inviteStaff(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<List<CommunityResponse>> getAllCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }
}