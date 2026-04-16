package com.firmatrack.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI firmatrackOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("FirmaTrack API")
                .description("API de gestion de ferme - Production laitière")
                .version("1.0.0"));
    }
}