package com.communityplatform.levy.mapper;


import com.communityplatform.levy.dtos.request.CreateLevyRequest;
import com.communityplatform.levy.dtos.response.HouseLevyResponse;
import com.communityplatform.levy.dtos.response.LevyTypeResponse;
import com.communityplatform.levy.model.data.HouseLevy;
import com.communityplatform.levy.model.data.LevyType;

import java.util.UUID;

public class LevyMapper {

    private LevyMapper() {}

    public static LevyTypeResponse toResponse(LevyType levyType, int housesBilled) {
        return new LevyTypeResponse(
                levyType.getId(),
                levyType.getName(),
                levyType.getAmount(),
                levyType.getFrequency(),
                housesBilled
        );
    }

    public static HouseLevyResponse toResponse(HouseLevy houseLevy, String levyName) {
        return new HouseLevyResponse(
                houseLevy.getId(),
                levyName,
                houseLevy.getAmount(),
                houseLevy.getBalance(),
                houseLevy.getDueDate(),
                houseLevy.getStatus()
        );
    }


    public static LevyType mapCreateLevyRequest(CreateLevyRequest request, UUID communityId){
     return LevyType.builder()
                .communityId(communityId)
                .name(request.getName())
                .amount(request.getAmount())
                .frequency(request.getFrequency())
                .active(true)
                .build();
    }

}
