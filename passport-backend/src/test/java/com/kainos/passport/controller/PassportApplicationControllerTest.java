package com.kainos.passport.controller;

import com.kainos.passport.dto.ApplicationMapper;
import com.kainos.passport.dto.applicationV1.ApplicationResponseV1;
import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationV2.ApplicationResponseV2;
import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

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
        private CreateApplicationRequestV2 validRequestV2;
    private PassportApplication savedApplication;
    private ApplicationResponseV1 responseV1;
        private ApplicationResponseV2 responseV2;

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

        validRequestV2 = CreateApplicationRequestV2.builder()
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

        responseV2 = ApplicationResponseV2.builder()
                .applicationId(applicationId)
                .status("IN_PROGRESS")
                .createdAt(createdAt)
                .application(ApplicationResponseV2.ApplicationData.builder()
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

                @BeforeEach
                void enableChildRenewals() {
                        ReflectionTestUtils.setField(controller, "childRenewalsEnabled", true);
                }

                @Test
                @DisplayName("Should return 404 when the child renewal flag is disabled")
                void createApplicationV2_shouldReturn404_whenFlagDisabled() {
                        ReflectionTestUtils.setField(controller, "childRenewalsEnabled", false);

                        ResponseEntity<ApplicationResponseV2> response = controller.createApplicationV2(validRequestV2);

                        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                        verifyNoInteractions(applicationService, applicationMapper);
                }

                @Test
                @DisplayName("Should return 201 Created when v2 application is created successfully")
                void createApplicationV2_shouldReturn201_whenSuccessful() {
                        when(applicationService.createApplication(any(CreateApplicationRequestV2.class)))
                                        .thenReturn(savedApplication);
                        when(applicationMapper.toV2(savedApplication, validRequestV2)).thenReturn(responseV2);

                        ResponseEntity<ApplicationResponseV2> response = controller.createApplicationV2(validRequestV2);

                        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
                        assertThat(response.getBody()).isEqualTo(responseV2);
                }
        }
}
