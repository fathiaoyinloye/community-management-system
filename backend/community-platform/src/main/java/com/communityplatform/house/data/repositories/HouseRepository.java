package com.communityplatform.house.data.repositories;

import com.communityplatform.house.data.model.House;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HouseRepository extends JpaRepository <House, UUID>{
    boolean existsByCommunityIdAndHouseNumber(UUID communityId, String houseNumber);
    List<House> findByCommunityId(UUID communityId);
    Optional<House> findByResidentId(UUID residentId);

}
