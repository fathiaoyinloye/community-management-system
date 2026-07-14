package com.communityplatform.levy.service.interfaces;

import com.communityplatform.levy.dtos.request.CreateLevyRequest;
import com.communityplatform.levy.dtos.response.HouseLevyResponse;
import com.communityplatform.levy.dtos.response.LevyTypeResponse;

import java.util.List;

public interface LevyService {
    LevyTypeResponse createLevy(CreateLevyRequest request);

    List<HouseLevyResponse> viewMyOutstandingBalance();
}
