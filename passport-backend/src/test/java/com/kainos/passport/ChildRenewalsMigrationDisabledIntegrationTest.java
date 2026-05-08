package com.kainos.passport;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
        "feature.child-renewals.enabled=false",
        "spring.datasource.url=jdbc:h2:mem:passport_applications_migration_disabled;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE"
})
@DisplayName("Child renewal migrations disabled")
class ChildRenewalsMigrationDisabledIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @DisplayName("Should keep parent detail columns out of the schema when the feature flag is off")
    void shouldOnlyApplyV1MigrationsWhenFlagOff() {
        List<String> columns = jdbcTemplate.queryForList(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'passport_applications'
                """,
                String.class);

        assertThat(columns)
                .contains("id", "status", "date_of_birth", "postcode")
                .doesNotContain("parent1_full_name", "parent1_contact", "parent2_full_name", "parent2_contact");
    }
}