package com.communityplatform.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class ObjectMapperConfig {

    @Bean
    @Primary // Tells Spring to use this one as the default if other libraries try to inject an ObjectMapper
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
