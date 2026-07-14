package com.communityplatform.levy.model.repository;

import com.communityplatform.levy.model.data.HouseLevy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HouseLevyRepository extends JpaRepository {
    List<HouseLevy> findByHouseId(UUID houseId);

}
