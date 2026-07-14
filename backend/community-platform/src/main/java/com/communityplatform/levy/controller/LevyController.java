package com.communityplatform.levy.controller;


import com.communityplatform.levy.dtos.request.CreateLevyRequest;
import com.communityplatform.levy.dtos.response.HouseLevyResponse;
import com.communityplatform.levy.dtos.response.LevyTypeResponse;
import com.communityplatform.levy.service.interfaces.LevyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/levies")
@RequiredArgsConstructor
public class LevyController {

    private final LevyService levyService;

    @PostMapping
    @PreAuthorize("hasRole('COMMUNITY_STAFF')")
    public ResponseEntity<LevyTypeResponse> createLevy(@Valid @RequestBody CreateLevyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(levyService.createLevy(request));
    }

    @GetMapping("/my-balance")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<List<HouseLevyResponse>> viewMyOutstandingBalance() {
        return ResponseEntity.ok(levyService.viewMyOutstandingBalance());
    }
}
