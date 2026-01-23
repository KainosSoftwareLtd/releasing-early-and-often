package com.kainos.passport.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI passportApplicationOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("UK Passport Application API")
                        .description("REST API for managing UK passport applications")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Kainos Team"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }

    @Bean
    public GroupedOpenApi passportApi() {
        return GroupedOpenApi.builder()
                .group("passport-api")
                .pathsToMatch("/api/**")
                .build();
    }
}