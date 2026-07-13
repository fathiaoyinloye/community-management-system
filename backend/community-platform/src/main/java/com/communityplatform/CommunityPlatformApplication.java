package com.communityplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CommunityPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommunityPlatformApplication.class, args);
	}

}
