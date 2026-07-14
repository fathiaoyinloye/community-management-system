package com.communityplatform.levy.model.repository;

import com.communityplatform.levy.model.data.LevyType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LevyTypeRepository extends JpaRepository <LevyType, UUID>{
}
