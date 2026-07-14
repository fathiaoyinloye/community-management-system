package com.communityplatform.house.service.implementations;

import com.communityplatform.auth.data.model.Role;
import com.communityplatform.auth.data.model.User;
import com.communityplatform.auth.dto.request.CreatePendingUserRequest;
import com.communityplatform.auth.dto.response.UserActivationResponse;
import com.communityplatform.auth.services.interfaces.UserService;
import com.communityplatform.common.exception.ResourceNotFoundException;
import com.communityplatform.house.data.model.House;
import com.communityplatform.house.data.repositories.HouseRepository;
import com.communityplatform.house.dtos.request.AssignResidentRequest;
import com.communityplatform.house.dtos.request.RegisterHouseRequest;
import com.communityplatform.house.dtos.response.HouseResponse;
import com.communityplatform.house.mapper.HouseMapper;
import com.communityplatform.house.service.interfaces.HouseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class HouseServiceImpl implements HouseService {
    private final HouseRepository houseRepository;
    private final UserService userService;

    @Override
    public HouseResponse registerHouse(RegisterHouseRequest request) {
        User currentStaff = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID communityId = currentStaff.getCommunityId();

        if (houseRepository.existsByCommunityIdAndHouseNumber(communityId, request.getHouseNumber())) {
            throw new IllegalStateException("A house with this number already exists in this community");
        }

        House house = House.builder()
                .communityId(communityId)
                .houseNumber(request.getHouseNumber())
                .street(request.getStreet())
                .residentId(null)
                .build();

        houseRepository.save(house);
        log.info("House registered: id={} houseNumber={} community={}", house.getId(), house.getHouseNumber(), communityId);

        return HouseMapper.toResponse(house);
    }

    @Override
    public UserActivationResponse assignResident(UUID houseId, AssignResidentRequest request) {
        House house = houseRepository.findById(houseId)
                .orElseThrow(() -> new ResourceNotFoundException("House not found: " + houseId));

        if (house.getResidentId() != null) {
            throw new IllegalStateException("This house already has a responsible resident assigned");
        }

        CreatePendingUserRequest pendingUserRequest = CreatePendingUserRequest.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(Role.RESIDENT)
                .communityId(house.getCommunityId())
                .build();

        UserActivationResponse response = userService.createPendingUser(pendingUserRequest);

        house.setResidentId(response.userId());
        houseRepository.save(house);

        log.info("Resident assigned to house={}: residentId={}", house.getId(), response.userId());
        return response;
    }
}
