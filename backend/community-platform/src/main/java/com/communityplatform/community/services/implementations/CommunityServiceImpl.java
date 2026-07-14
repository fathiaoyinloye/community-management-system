package com.communityplatform.community.services.implementations;

import com.communityplatform.auth.data.model.User;
import com.communityplatform.community.data.model.Community;
import com.communityplatform.auth.data.model.Role;
import com.communityplatform.community.data.repository.CommunityRepository;
import com.communityplatform.community.dtos.request.AssignCommunityAdminRequest;
import com.communityplatform.community.dtos.request.CreateCommunityRequest;
import com.communityplatform.auth.dto.request.CreatePendingUserRequest;
import com.communityplatform.community.dtos.request.InviteStaffRequest;
import com.communityplatform.community.dtos.responses.CommunityResponse;
import com.communityplatform.auth.dto.response.UserActivationResponse;
import com.communityplatform.community.services.interfaces.CommunityService;
import com.communityplatform.auth.services.interfaces.UserService;
import com.communityplatform.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static com.communityplatform.community.mapper.CommunityMapper.toResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

    private final CommunityRepository communityRepository;
    private final UserService userService;

    @Override
    public CommunityResponse createCommunity(CreateCommunityRequest request) {
        if (communityRepository.existsByName(request.getName())) {
            throw new IllegalStateException("A community with this name already exists");
        }

        Community community = Community.builder()
                .name(request.getName())
                .type(request.getType())
                .address(request.getAddress())
                .lga(request.getLga())
                .state(request.getState())
                .phone(request.getPhone())
                .email(request.getEmail())
                .description(request.getDescription())
                .build();

        communityRepository.save(community);
        log.info("Community created: id={} name={}", community.getId(), community.getName());

        return toResponse(community);
    }

    @Override
    public UserActivationResponse assignCommunityAdministrator(UUID communityId, AssignCommunityAdminRequest request) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found: " + communityId));

        CreatePendingUserRequest pendingUserRequest = CreatePendingUserRequest.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(Role.COMMUNITY_ADMIN)
                .communityId(community.getId())
                .build();

        UserActivationResponse response = userService.createPendingUser(pendingUserRequest);

        log.info("Community Administrator invited for community={} phone={}", community.getName(), request.getPhone());
        return response;
    }



    @Override
    public UserActivationResponse inviteStaff(InviteStaffRequest request) {
        User currentAdmin = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        CreatePendingUserRequest pendingUserRequest = CreatePendingUserRequest.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(Role.COMMUNITY_STAFF)
                .communityId(currentAdmin.getCommunityId())
                .build();

        UserActivationResponse response = userService.createPendingUser(pendingUserRequest);

        log.info("Staff invited by admin={} into community={}", currentAdmin.getUsername(), currentAdmin.getCommunityId());
        return response;
    }


}