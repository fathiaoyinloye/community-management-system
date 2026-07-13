package com.communityplatform.auth.data.repositories;

import com.communityplatform.auth.data.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CommunityRepository extends JpaRepository <Community, UUID>{
    boolean existsByName(String name);

}
