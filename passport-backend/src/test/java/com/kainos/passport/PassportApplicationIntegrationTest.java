package com.kainos.passport;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
import com.kainos.passport.entity.PassportApplication;
import com.kainos.passport.repository.PassportApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@DisplayName("Passport Application Integration Tests")
class PassportApplicationIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private ObjectMapper objectMapper;

    @Autowired
    private PassportApplicationRepository applicationRepository;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        applicationRepository.deleteAll();
    }

    @Test
    @DisplayName("Should create application and persist to database")
    void createApplication_shouldPersistToDatabase() throws Exception {
        CreateApplicationRequestV1 request = CreateApplicationRequestV1.builder()
                .dateOfBirth("1990-05-15")
                .previousPassport("yes")
                .addressLine1("123 Main Street")
                .addressLine2("Apt 4B")
                .townCity("London")
                .postcode("SW1A 1AA")
                .build();

        mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "1.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        List<PassportApplication> applications = applicationRepository.findAll();
        assertThat(applications).hasSize(1);

        PassportApplication saved = applications.get(0);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getDateOfBirth()).isEqualTo("1990-05-15");
        assertThat(saved.getPreviousPassport()).isEqualTo("yes");
        assertThat(saved.getAddressLine1()).isEqualTo("123 Main Street");
        assertThat(saved.getAddressLine2()).isEqualTo("Apt 4B");
        assertThat(saved.getTownCity()).isEqualTo("London");
        assertThat(saved.getPostcode()).isEqualTo("SW1A 1AA");
        assertThat(saved.getStatus()).isEqualTo(PassportApplication.ApplicationStatus.IN_PROGRESS);
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should return created application ID in response")
    void createApplication_shouldReturnApplicationIdInResponse() throws Exception {
        CreateApplicationRequestV1 request = CreateApplicationRequestV1.builder()
                .dateOfBirth("1985-12-25")
                .addressLine1("456 Oak Avenue")
                .townCity("Manchester")
                .postcode("M1 1AA")
                .build();

        MvcResult result = mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "1.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.applicationId").exists())
                .andReturn();

        // Verify the returned ID matches what's in the database
        List<PassportApplication> applications = applicationRepository.findAll();
        assertThat(applications).hasSize(1);

        String responseBody = result.getResponse().getContentAsString();
        assertThat(responseBody).contains(applications.get(0).getId().toString());
    }

    @Test
    @DisplayName("Should create multiple independent applications")
    void createApplication_shouldCreateMultipleIndependentApplications() throws Exception {
        CreateApplicationRequestV1 request1 = CreateApplicationRequestV1.builder()
                .dateOfBirth("1990-01-01")
                .addressLine1("First Address")
                .townCity("London")
                .postcode("SW1A 1AA")
                .build();

        CreateApplicationRequestV1 request2 = CreateApplicationRequestV1.builder()
                .dateOfBirth("1985-06-15")
                .addressLine1("Second Address")
                .townCity("Edinburgh")
                .postcode("EH1 1AA")
                .build();

        mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "1.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "1.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isCreated());

        List<PassportApplication> applications = applicationRepository.findAll();
        assertThat(applications).hasSize(2);
        assertThat(applications.get(0).getId()).isNotEqualTo(applications.get(1).getId());
    }

    @Test
    @DisplayName("Should reject request with missing required fields")
    void createApplication_shouldRejectMissingRequiredFields() throws Exception {
        // Missing all required fields
        String invalidJson = "{}";

        mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "1.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());

        // Verify nothing was persisted
        List<PassportApplication> applications = applicationRepository.findAll();
        assertThat(applications).isEmpty();
    }

    @Test
    @DisplayName("Should reject empty string for required fields")
    void createApplication_shouldRejectEmptyRequiredFields() throws Exception {
        CreateApplicationRequestV1 request = CreateApplicationRequestV1.builder()
                .dateOfBirth("")
                .addressLine1("123 Main Street")
                .townCity("London")
                .postcode("SW1A 1AA")
                .build();

        mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "1.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        List<PassportApplication> applications = applicationRepository.findAll();
        assertThat(applications).isEmpty();
    }

    @Test
    @DisplayName("Should create V2 application with parent details and persist to database")
    void createApplicationV2_shouldPersistToDatabase() throws Exception {
        CreateApplicationRequestV2 request = CreateApplicationRequestV2.builder()
                .dateOfBirth("2012-03-15")
                .previousPassport("no")
                .addressLine1("123 Main Street")
                .addressLine2("Apt 4B")
                .townCity("London")
                .postcode("SW1A 1AA")
                .parent1FullName("Jane Doe")
                .parent1Contact("jane.doe@example.com")
                .parent2FullName("John Doe")
                .parent2Contact("john.doe@example.com")
                .build();

        mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "2.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        List<PassportApplication> applications = applicationRepository.findAll();
        assertThat(applications).hasSize(1);

        PassportApplication saved = applications.get(0);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getDateOfBirth()).isEqualTo("2012-03-15");
        assertThat(saved.getPreviousPassport()).isEqualTo("no");
        assertThat(saved.getParent1FullName()).isEqualTo("Jane Doe");
        assertThat(saved.getParent1Contact()).isEqualTo("jane.doe@example.com");
        assertThat(saved.getParent2FullName()).isEqualTo("John Doe");
        assertThat(saved.getParent2Contact()).isEqualTo("john.doe@example.com");
        assertThat(saved.getStatus()).isEqualTo(PassportApplication.ApplicationStatus.IN_PROGRESS);
    }

    @Test
    @DisplayName("Should return V2 response including parent details")
    void createApplicationV2_shouldReturnParentDetailsInResponse() throws Exception {
        CreateApplicationRequestV2 request = CreateApplicationRequestV2.builder()
                .dateOfBirth("2012-03-15")
                .addressLine1("123 Main Street")
                .townCity("London")
                .postcode("SW1A 1AA")
                .parent1FullName("Jane Doe")
                .parent1Contact("jane.doe@example.com")
                .build();

        mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "2.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.applicationId").exists())
                .andExpect(jsonPath("$.application.parent1FullName").value("Jane Doe"))
                .andExpect(jsonPath("$.application.parent1Contact").value("jane.doe@example.com"));
    }

    @Test
    @DisplayName("Should reject V2 request missing required parent details")
    void createApplicationV2_shouldRejectMissingParentDetails() throws Exception {
        CreateApplicationRequestV2 request = CreateApplicationRequestV2.builder()
                .dateOfBirth("2012-03-15")
                .addressLine1("123 Main Street")
                .townCity("London")
                .postcode("SW1A 1AA")
                // parent1FullName and parent1Contact intentionally omitted
                .build();

        mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "2.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        List<PassportApplication> applications = applicationRepository.findAll();
        assertThat(applications).isEmpty();
    }

    @Test
    @DisplayName("Should persist V2 application with optional parent 2 omitted")
    void createApplicationV2_shouldAllowOptionalParent2() throws Exception {
        CreateApplicationRequestV2 request = CreateApplicationRequestV2.builder()
                .dateOfBirth("2012-03-15")
                .addressLine1("123 Main Street")
                .townCity("London")
                .postcode("SW1A 1AA")
                .parent1FullName("Jane Doe")
                .parent1Contact("jane.doe@example.com")
                // parent2 fields intentionally omitted
                .build();

        mockMvc.perform(post("/api/applications")
                        .header("X-API-Version", "2.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        List<PassportApplication> applications = applicationRepository.findAll();
        assertThat(applications).hasSize(1);
        assertThat(applications.get(0).getParent2FullName()).isNull();
        assertThat(applications.get(0).getParent2Contact()).isNull();
    }
}
