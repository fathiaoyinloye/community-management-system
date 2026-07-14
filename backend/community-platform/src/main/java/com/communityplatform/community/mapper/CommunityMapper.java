package com.communityplatform.community.mapper;

import com.communityplatform.community.data.model.Community;
import com.communityplatform.community.dtos.responses.CommunityResponse;

public class CommunityMapper {

    private CommunityMapper() {}

    public static CommunityResponse toResponse(Community community) {
        return new CommunityResponse(
                community.getId(),
                community.getName(),
                community.getType(),
                community.getAddress(),
                community.getLga(),
                community.getState(),
                community.getPhone(),
                community.getEmail(),
                community.getDescription(),
                community.getCreatedAt()
        );
    }
}
