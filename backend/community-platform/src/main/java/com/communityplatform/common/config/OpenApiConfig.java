package com.communityplatform.common.config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI communityPlatformOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Community Management System API")
                        .version("1.0")
                        .description("Auth is via HttpOnly cookie, not Bearer token. Log in via /auth/login first — the browser will carry the cookie automatically for subsequent 'Try it out' calls in this UI."))
                .components(new Components()
                        .addSecuritySchemes("cookieAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.COOKIE)
                                        .name("jwt")));
    }
}