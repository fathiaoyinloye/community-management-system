package com.communityplatform.community.data.repository;

import com.communityplatform.community.data.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CommunityRepository extends JpaRepository <Community, UUID>{
    boolean existsByName(String name);

}
