package com.communityplatform.house.controller;

import com.communityplatform.auth.dto.response.UserActivationResponse;
import com.communityplatform.house.dtos.request.AssignResidentRequest;
import com.communityplatform.house.dtos.request.RegisterHouseRequest;
import com.communityplatform.house.dtos.response.HouseResponse;
import com.communityplatform.house.service.interfaces.HouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/houses")
@RequiredArgsConstructor
public class HouseController {

    private final HouseService houseService;

    @PostMapping
    @PreAuthorize("hasRole('COMMUNITY_STAFF')")
    public ResponseEntity<HouseResponse> registerHouse(@Valid @RequestBody RegisterHouseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(houseService.registerHouse(request));
    }

    @PostMapping("/{houseId}/assign-resident")
    @PreAuthorize("hasRole('COMMUNITY_STAFF')")
    public ResponseEntity<UserActivationResponse> assignResident(
            @PathVariable UUID houseId,
            @Valid @RequestBody AssignResidentRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(houseService.assignResident(houseId, request));
    }
}

