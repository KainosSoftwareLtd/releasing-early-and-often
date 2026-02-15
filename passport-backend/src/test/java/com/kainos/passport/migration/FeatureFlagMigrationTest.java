package com.kainos.passport.migration;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for feature-flagged database migrations.
 *
 * Nested classes run alphabetically: Disabled -> Enabled
 * Matches the real-world deployment order:
 * 1. Initial deploy with flag=false (V1 only)
 * 2. Later deploy with flag=true (V1 + V2)
 */
@DisplayName("Feature Flag Migration Tests")
class FeatureFlagMigrationTest {

    @Nested
    @SpringBootTest
    @TestPropertySource(properties = {
            "feature.child-renewals.enabled=false",
            "spring.flyway.clean-disabled=false"
    })
    @DirtiesContext
    @DisplayName("Step 1: When feature flag is disabled")
    class WhenFeatureFlagDisabled {

        @Autowired
        private DataSource dataSource;

        @BeforeAll
        static void cleanDatabase(@Autowired Flyway flyway) {
            // Clean the database before this test class runs
            flyway.clean();
            flyway.migrate();
        }

        @Test
        @DisplayName("Only V1 migration runs, no parent columns exist")
        void onlyV1ColumnsShouldExist() throws Exception {
            Set<String> columnNames = getTableColumnNames("passport_applications", dataSource);

            assertThat(columnNames).contains(
                    "id", "status", "created_at", "updated_at",
                    "date_of_birth", "previous_passport",
                    "address_line_1", "address_line_2", "town_city", "postcode"
            );

            assertThat(columnNames)
                    .as("V2 parent columns should not exist when feature flag is disabled")
                    .doesNotContain("parent1_full_name", "parent1_contact",
                            "parent2_full_name", "parent2_contact");
        }
    }

    @Nested
    @SpringBootTest
    @TestPropertySource(properties = {
            "feature.child-renewals.enabled=true",
            "spring.flyway.clean-disabled=false"
    })
    @DirtiesContext
    @DisplayName("Step 2: When feature flag is enabled")
    class WhenFeatureFlagEnabled {

        @Autowired
        private DataSource dataSource;

        @BeforeAll
        static void cleanDatabase(@Autowired Flyway flyway) {
            // Clean the database before this test class runs
            flyway.clean();
            flyway.migrate();
        }

        @Test
        @DisplayName("V2 migration runs and adds parent columns")
        void V2ColumnsShouldBeAdded() throws Exception {
            Set<String> columnNames = getTableColumnNames("passport_applications", dataSource);

            assertThat(columnNames).contains(
                    "id", "status", "created_at", "updated_at",
                    "date_of_birth", "previous_passport",
                    "address_line_1", "address_line_2", "town_city", "postcode"
            );

            assertThat(columnNames)
                    .as("V2 parent columns should exist when feature flag is enabled")
                    .contains("parent1_full_name", "parent1_contact",
                            "parent2_full_name", "parent2_contact");
        }
    }

    private static Set<String> getTableColumnNames(String tableName, DataSource dataSource) throws Exception {
        Set<String> columns = new HashSet<>();
        try (Connection connection = dataSource.getConnection()) {
            String query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'public' AND TABLE_NAME = ?";
            try (var stmt = connection.prepareStatement(query)) {
                stmt.setString(1, tableName.toLowerCase());
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        columns.add(rs.getString("COLUMN_NAME").toLowerCase());
                    }
                }
            }
        }
        return columns;
    }
}
