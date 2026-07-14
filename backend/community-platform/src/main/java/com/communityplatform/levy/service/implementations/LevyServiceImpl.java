package com.communityplatform.levy.service.implementations;


import com.communityplatform.auth.data.model.User;
import com.communityplatform.common.exception.ResourceNotFoundException;
import com.communityplatform.house.data.model.House;
import com.communityplatform.house.data.repositories.HouseRepository;
import com.communityplatform.levy.dtos.request.CreateLevyRequest;
import com.communityplatform.levy.dtos.response.HouseLevyResponse;
import com.communityplatform.levy.dtos.response.LevyTypeResponse;
import com.communityplatform.levy.mapper.LevyMapper;
import com.communityplatform.levy.model.data.HouseLevy;
import com.communityplatform.levy.model.data.HouseLevyStatus;
import com.communityplatform.levy.model.data.LevyType;
import com.communityplatform.levy.model.repository.HouseLevyRepository;
import com.communityplatform.levy.model.repository.LevyTypeRepository;
import com.communityplatform.levy.service.interfaces.LevyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LevyServiceImpl implements LevyService {

    private final LevyTypeRepository levyTypeRepository;
    private final HouseLevyRepository houseLevyRepository;
    private final HouseRepository houseRepository;

    @Override
    @Transactional
    public LevyTypeResponse createLevy(CreateLevyRequest request) {
        User currentStaff = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
        assert currentStaff != null;
        UUID communityId = currentStaff.getCommunityId();

        LevyType levyType = LevyMapper.mapCreateLevyRequest(request, communityId);
        levyTypeRepository.save(levyType);
        log.info("Levy type created: id={} name={} community={}", levyType.getId(), levyType.getName(), communityId);

        List<House> houses = houseRepository.findByCommunityId(communityId);

        List<HouseLevy> houseLevies = houses.stream()
                .map(house -> HouseLevy.builder()
                        .houseId(house.getId())
                        .levyTypeId(levyType.getId())
                        .amount(request.getAmount())
                        .balance(request.getAmount())
                        .billingPeriod(LocalDate.now().toString())
                        .dueDate(LocalDate.now().plusDays(30))
                        .status(HouseLevyStatus.PENDING)
                        .build())
                .collect(Collectors.toList());

        houseLevyRepository.saveAll(houseLevies);
        log.info("Levy '{}' applied to {} house(s) in community={}", levyType.getName(), houseLevies.size(), communityId);

        return LevyMapper.toResponse(levyType, houseLevies.size());
    }

    @Override
    public List<HouseLevyResponse> viewMyOutstandingBalance() {
        User currentResident = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();

        House house = houseRepository.findByResidentId(currentResident.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No house is registered to this resident"));

        List<HouseLevy> houseLevies = houseLevyRepository.findByHouseId(house.getId());

        Map<UUID, LevyType> levyTypesById = levyTypeRepository.findAllById(
                houseLevies.stream().map(HouseLevy::getLevyTypeId).collect(Collectors.toSet())
        ).stream().collect(Collectors.toMap(LevyType::getId, lt -> lt));

        return houseLevies.stream()
                .map(hl -> LevyMapper.toResponse(hl, levyTypesById.get(hl.getLevyTypeId()).getName()))
                .toList();
    }
}