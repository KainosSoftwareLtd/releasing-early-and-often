package com.kainos.passport;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "feature.child-renewals.enabled=true",
        "spring.datasource.url=jdbc:h2:mem:passport_applications_migration_enabled;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE"
})
@DisplayName("Child renewal migrations enabled")
class ChildRenewalsMigrationEnabledIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        jdbcTemplate.update("DELETE FROM passport_applications");
    }

    @Test
    @DisplayName("Should add parent detail columns when the feature flag is on")
    void shouldApplyV2MigrationWhenFlagOn() {
        List<String> columns = jdbcTemplate.queryForList(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'passport_applications'
                """,
                String.class);

        assertThat(columns).contains(
                "parent1_full_name",
                "parent1_contact",
                "parent2_full_name",
                "parent2_contact");
    }

    @Test
    @DisplayName("Should persist parent details through the v2 endpoint")
    void shouldPersistParentDetailsViaV2Endpoint() throws Exception {
        CreateApplicationRequestV2 request = CreateApplicationRequestV2.builder()
                .dateOfBirth("2014-05-15")
                .previousPassport("no")
                .addressLine1("123 Main Street")
                .addressLine2("Apt 4B")
                .townCity("London")
                .postcode("SW1A 1AA")
                .parent1FullName("Alex Example")
                .parent1Contact("alex@example.com")
                .parent2FullName("Sam Example")
                .parent2Contact("sam@example.com")
                .build();

        mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "2.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.application.parent1FullName").value("Alex Example"))
                .andExpect(jsonPath("$.application.parent2Contact").value("sam@example.com"));

        Map<String, Object> savedRow = jdbcTemplate.queryForMap(
                """
                SELECT parent1_full_name, parent1_contact, parent2_full_name, parent2_contact
                FROM passport_applications
                """);

        assertThat(savedRow.get("parent1_full_name")).isEqualTo("Alex Example");
        assertThat(savedRow.get("parent1_contact")).isEqualTo("alex@example.com");
        assertThat(savedRow.get("parent2_full_name")).isEqualTo("Sam Example");
        assertThat(savedRow.get("parent2_contact")).isEqualTo("sam@example.com");
    }
}