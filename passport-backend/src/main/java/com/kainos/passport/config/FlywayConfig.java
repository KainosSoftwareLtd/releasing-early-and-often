package com.kainos.passport.config;

import org.flywaydb.core.api.MigrationVersion;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.flyway.autoconfigure.FlywayConfigurationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Bean
    FlywayConfigurationCustomizer childRenewalsFlywayTarget(
            @Value("${feature.child-renewals.enabled:false}") boolean childRenewalsEnabled) {
        return configuration -> configuration.target(
                MigrationVersion.fromVersion(childRenewalsEnabled ? "2" : "1"));
    }
}