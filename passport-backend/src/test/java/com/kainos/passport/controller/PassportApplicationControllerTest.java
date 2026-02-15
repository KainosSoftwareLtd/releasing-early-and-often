package com.kainos.passport.controller;

import com.kainos.passport.dto.ApplicationMapper;
import com.kainos.passport.dto.applicationV1.ApplicationResponseV1;
import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationv2.ApplicationResponseV2;
import com.kainos.passport.dto.applicationv2.CreateApplicationRequestV2;
import com.kainos.passport.entity.PassportApplication;
import com.kainos.passport.service.PassportApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PassportApplicationController Tests")
class PassportApplicationControllerTest {

    @Mock
    private PassportApplicationService applicationService;

    @Mock
    private ApplicationMapper applicationMapper;

    @InjectMocks
    private PassportApplicationController controller;

    private CreateApplicationRequestV1 validRequest;
    private PassportApplication savedApplication;
    private ApplicationResponseV1 responseV1;

    @BeforeEach
    void setUp() {
        validRequest = CreateApplicationRequestV1.builder()
                .dateOfBirth("1990-05-15")
                .previousPassport("yes")
                .addressLine1("123 Main Street")
                .addressLine2("Apt 4B")
                .townCity("London")
                .postcode("SW1A 1AA")
                .build();

        UUID applicationId = UUID.randomUUID();
        LocalDateTime createdAt = LocalDateTime.now();

        savedApplication = new PassportApplication();
        savedApplication.setId(applicationId);
        savedApplication.setDateOfBirth("1990-05-15");
        savedApplication.setPreviousPassport("yes");
        savedApplication.setAddressLine1("123 Main Street");
        savedApplication.setAddressLine2("Apt 4B");
        savedApplication.setTownCity("London");
        savedApplication.setPostcode("SW1A 1AA");
        savedApplication.setStatus(PassportApplication.ApplicationStatus.IN_PROGRESS);
        savedApplication.setCreatedAt(createdAt);
        savedApplication.setUpdatedAt(createdAt);

        responseV1 = ApplicationResponseV1.builder()
                .applicationId(applicationId)
                .status("IN_PROGRESS")
                .createdAt(createdAt)
                .application(ApplicationResponseV1.ApplicationData.builder()
                        .dateOfBirth("1990-05-15")
                        .previousPassport("yes")
                        .addressLine1("123 Main Street")
                        .addressLine2("Apt 4B")
                        .townCity("London")
                        .postcode("SW1A 1AA")
                        .build())
                .build();
    }

    @Nested
    @DisplayName("createApplicationV1()")
    class CreateApplicationV1Tests {

        @Test
        @DisplayName("Should return 201 Created when application is created successfully")
        void createApplication_shouldReturn201_whenSuccessful() {
            when(applicationService.createApplication(any(CreateApplicationRequestV1.class)))
                    .thenReturn(savedApplication);
            when(applicationMapper.toV1(savedApplication)).thenReturn(responseV1);

            ResponseEntity<ApplicationResponseV1> response = controller.createApplicationV1(validRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        }

        @Test
        @DisplayName("Should return application response in body")
        void createApplication_shouldReturnApplicationResponse() {
            when(applicationService.createApplication(any(CreateApplicationRequestV1.class)))
                    .thenReturn(savedApplication);
            when(applicationMapper.toV1(savedApplication)).thenReturn(responseV1);

            ResponseEntity<ApplicationResponseV1> response = controller.createApplicationV1(validRequest);

            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getApplicationId()).isEqualTo(savedApplication.getId());
            assertThat(response.getBody().getStatus()).isEqualTo("IN_PROGRESS");
        }

        @Test
        @DisplayName("Should return application data in response")
        void createApplication_shouldReturnApplicationData() {
            when(applicationService.createApplication(any(CreateApplicationRequestV1.class)))
                    .thenReturn(savedApplication);
            when(applicationMapper.toV1(savedApplication)).thenReturn(responseV1);

            ResponseEntity<ApplicationResponseV1> response = controller.createApplicationV1(validRequest);

            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getApplication()).isNotNull();
            assertThat(response.getBody().getApplication().getDateOfBirth()).isEqualTo("1990-05-15");
            assertThat(response.getBody().getApplication().getAddressLine1()).isEqualTo("123 Main Street");
        }

        @Test
        @DisplayName("Should call service with request")
        void createApplication_shouldCallServiceWithRequest() {
            when(applicationService.createApplication(any(CreateApplicationRequestV1.class)))
                    .thenReturn(savedApplication);
            when(applicationMapper.toV1(savedApplication)).thenReturn(responseV1);

            controller.createApplicationV1(validRequest);

            verify(applicationService, times(1)).createApplication(validRequest);
        }

        @Test
        @DisplayName("Should call mapper to convert to response")
        void createApplication_shouldCallMapperToConvertResponse() {
            when(applicationService.createApplication(any(CreateApplicationRequestV1.class)))
                    .thenReturn(savedApplication);
            when(applicationMapper.toV1(savedApplication)).thenReturn(responseV1);

            controller.createApplicationV1(validRequest);

            verify(applicationMapper, times(1)).toV1(savedApplication);
        }

        @Test
        @DisplayName("Should return 500 Internal Server Error when service throws exception")
        void createApplication_shouldReturn500_whenServiceThrowsException() {
            when(applicationService.createApplication(any(CreateApplicationRequestV1.class)))
                    .thenThrow(new RuntimeException("Database error"));

            ResponseEntity<ApplicationResponseV1> response = controller.createApplicationV1(validRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
            assertThat(response.getBody()).isNull();
        }

        @Test
        @DisplayName("Should return 500 Internal Server Error when mapper throws exception")
        void createApplication_shouldReturn500_whenMapperThrowsException() {
            when(applicationService.createApplication(any(CreateApplicationRequestV1.class)))
                    .thenReturn(savedApplication);
            when(applicationMapper.toV1(savedApplication))
                    .thenThrow(new RuntimeException("Mapping error"));

            ResponseEntity<ApplicationResponseV1> response = controller.createApplicationV1(validRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Nested
    @DisplayName("createApplicationV2()")
    class CreateApplicationV2Tests {

        private CreateApplicationRequestV2 validRequestV2;
        private PassportApplication savedApplicationV2;
        private ApplicationResponseV2 responseV2;

        @BeforeEach
        void setUp() {
            ReflectionTestUtils.setField(controller, "childRenewalsEnabled", true);
            validRequestV2 = CreateApplicationRequestV2.builder()
                    .dateOfBirth("2015-03-20")
                    .previousPassport("no")
                    .addressLine1("456 Park Avenue")
                    .addressLine2("Suite 10")
                    .townCity("Manchester")
                    .postcode("M1 2WD")
                    .parent1FullName("Jane Smith")
                    .parent1Contact("jane@example.com")
                    .parent2FullName("John Smith")
                    .parent2Contact("john@example.com")
                    .build();

            UUID applicationId = UUID.randomUUID();
            LocalDateTime createdAt = LocalDateTime.now();

            savedApplicationV2 = new PassportApplication();
            savedApplicationV2.setId(applicationId);
            savedApplicationV2.setDateOfBirth("2015-03-20");
            savedApplicationV2.setPreviousPassport("no");
            savedApplicationV2.setAddressLine1("456 Park Avenue");
            savedApplicationV2.setAddressLine2("Suite 10");
            savedApplicationV2.setTownCity("Manchester");
            savedApplicationV2.setPostcode("M1 2WD");
            savedApplicationV2.setParent1FullName("Jane Smith");
            savedApplicationV2.setParent1Contact("jane@example.com");
            savedApplicationV2.setParent2FullName("John Smith");
            savedApplicationV2.setParent2Contact("john@example.com");
            savedApplicationV2.setStatus(PassportApplication.ApplicationStatus.IN_PROGRESS);
            savedApplicationV2.setCreatedAt(createdAt);
            savedApplicationV2.setUpdatedAt(createdAt);

            responseV2 = ApplicationResponseV2.builder()
                    .applicationId(applicationId)
                    .status("IN_PROGRESS")
                    .createdAt(createdAt)
                    .application(ApplicationResponseV2.ApplicationData.builder()
                            .dateOfBirth("2015-03-20")
                            .previousPassport("no")
                            .addressLine1("456 Park Avenue")
                            .addressLine2("Suite 10")
                            .townCity("Manchester")
                            .postcode("M1 2WD")
                            .parent1FullName("Jane Smith")
                            .parent1Contact("jane@example.com")
                            .parent2FullName("John Smith")
                            .parent2Contact("john@example.com")
                            .build())
                    .build();
        }

        @Test
        @DisplayName("Should return 201 Created when V2 application with parent details is created successfully")
        void createApplicationV2_shouldReturn201_whenSuccessful() {
            when(applicationService.createApplication(any(CreateApplicationRequestV2.class)))
                    .thenReturn(savedApplicationV2);
            when(applicationMapper.toV2(savedApplicationV2)).thenReturn(responseV2);

            ResponseEntity<ApplicationResponseV2> response = controller.createApplicationV2(validRequestV2);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        }

        @Test
        @DisplayName("Should return application response with parent details")
        void createApplicationV2_shouldReturnResponseWithParentDetails() {
            when(applicationService.createApplication(any(CreateApplicationRequestV2.class)))
                    .thenReturn(savedApplicationV2);
            when(applicationMapper.toV2(savedApplicationV2)).thenReturn(responseV2);

            ResponseEntity<ApplicationResponseV2> response = controller.createApplicationV2(validRequestV2);

            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getApplication().getParent1FullName()).isEqualTo("Jane Smith");
            assertThat(response.getBody().getApplication().getParent1Contact()).isEqualTo("jane@example.com");
            assertThat(response.getBody().getApplication().getParent2FullName()).isEqualTo("John Smith");
            assertThat(response.getBody().getApplication().getParent2Contact()).isEqualTo("john@example.com");
        }

        @Test
        @DisplayName("Should call service with V2 request")
        void createApplicationV2_shouldCallServiceWithRequest() {
            when(applicationService.createApplication(any(CreateApplicationRequestV2.class)))
                    .thenReturn(savedApplicationV2);
            when(applicationMapper.toV2(savedApplicationV2)).thenReturn(responseV2);

            controller.createApplicationV2(validRequestV2);

            verify(applicationService, times(1)).createApplication(validRequestV2);
        }

        @Test
        @DisplayName("Should call mapper.toV2() to convert entity to V2 response")
        void createApplicationV2_shouldCallMapperToV2() {
            when(applicationService.createApplication(any(CreateApplicationRequestV2.class)))
                    .thenReturn(savedApplicationV2);
            when(applicationMapper.toV2(savedApplicationV2)).thenReturn(responseV2);

            controller.createApplicationV2(validRequestV2);

            verify(applicationMapper, times(1)).toV2(savedApplicationV2);
        }

        @Test
        @DisplayName("Should return 500 Internal Server Error when V2 service throws exception")
        void createApplicationV2_shouldReturn500_whenServiceThrowsException() {
            when(applicationService.createApplication(any(CreateApplicationRequestV2.class)))
                    .thenThrow(new RuntimeException("Database error"));

            ResponseEntity<ApplicationResponseV2> response = controller.createApplicationV2(validRequestV2);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
            assertThat(response.getBody()).isNull();
        }

        @Test
        @DisplayName("Should return 404 Not Found when child renewals feature flag is disabled")
        void createApplicationV2_shouldReturn404_whenFeatureFlagDisabled() {
            ReflectionTestUtils.setField(controller, "childRenewalsEnabled", false);

            ResponseEntity<ApplicationResponseV2> response = controller.createApplicationV2(validRequestV2);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            verifyNoInteractions(applicationService, applicationMapper);
        }
    }
}
