package com.communityplatform.community.services.interfaces;

import com.communityplatform.community.dtos.request.AssignCommunityAdminRequest;
import com.communityplatform.community.dtos.request.CreateCommunityRequest;
import com.communityplatform.community.dtos.responses.CommunityResponse;
import com.communityplatform.auth.dto.response.UserActivationResponse;

import java.util.UUID;

public interface CommunityService {

    CommunityResponse createCommunity(CreateCommunityRequest request);

    UserActivationResponse assignCommunityAdministrator(UUID communityId, AssignCommunityAdminRequest request);
}

