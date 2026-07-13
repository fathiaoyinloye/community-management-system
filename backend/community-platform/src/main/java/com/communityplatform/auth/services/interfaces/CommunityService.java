package com.communityplatform.auth.services.interfaces;

import com.communityplatform.auth.dto.request.AssignCommunityAdminRequest;
import com.communityplatform.auth.dto.request.CreateCommunityRequest;
import com.communityplatform.auth.dto.response.CommunityResponse;
import com.communityplatform.auth.dto.response.UserActivationResponse;

import java.util.UUID;

public interface CommunityService {

    CommunityResponse createCommunity(CreateCommunityRequest request);

    UserActivationResponse assignCommunityAdministrator(UUID communityId, AssignCommunityAdminRequest request);
}

