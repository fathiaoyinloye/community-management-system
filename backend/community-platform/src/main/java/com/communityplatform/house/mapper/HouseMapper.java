package com.communityplatform.house.mapper;

import com.communityplatform.house.data.model.House;
import com.communityplatform.house.dtos.response.HouseResponse;

public class HouseMapper {

    private HouseMapper() {}

    public static HouseResponse toResponse(House house) {
        return new HouseResponse(
                house.getId(),
                house.getCommunityId(),
                house.getResidentId(),
                house.getHouseNumber(),
                house.getStreet(),
                house.getCreatedAt()
        );
    }
}
