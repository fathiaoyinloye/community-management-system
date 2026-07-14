package com.communityplatform.house.service.interfaces;

import com.communityplatform.auth.dto.response.UserActivationResponse;
import com.communityplatform.house.dtos.request.AssignResidentRequest;
import com.communityplatform.house.dtos.request.RegisterHouseRequest;
import com.communityplatform.house.dtos.response.HouseResponse;

import java.util.UUID;

public interface HouseService {
    HouseResponse registerHouse(RegisterHouseRequest request);
    UserActivationResponse assignResident(UUID houseId, AssignResidentRequest request);
}

