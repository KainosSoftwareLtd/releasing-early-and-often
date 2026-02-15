package com.kainos.passport.config;

import org.flywaydb.core.api.configuration.FluentConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.flyway.autoconfigure.FlywayConfigurationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * Configuration for feature-flagged database migrations.
 * Conditionally applies V2 migration based on feature.child-renewals.enabled flag.
 */
@Configuration
public class FlywayConfig {

    @Value("${feature.child-renewals.enabled}")
    private boolean childRenewalsEnabled;

    @Bean
    public FlywayConfigurationCustomizer flywayConfigurationCustomizer() {
        return (FluentConfiguration configuration) -> {
            List<String> locations = new ArrayList<>();
            locations.add("classpath:db/migration");

            if (childRenewalsEnabled) {
                locations.add("classpath:db/migration-v2");
                System.out.println("Child renewals feature is ENABLED - applying V2 migration");
            } else {
                System.out.println("Child renewals feature is DISABLED - V2 migration will not run");
            }

            configuration.locations(locations.toArray(new String[0]));
        };
    }
}
