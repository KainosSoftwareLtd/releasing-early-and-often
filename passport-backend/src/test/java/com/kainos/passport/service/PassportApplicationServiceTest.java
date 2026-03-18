package com.kainos.passport.service;

import com.kainos.passport.dto.ApplicationMapper;
import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
import com.kainos.passport.entity.PassportApplication;
import com.kainos.passport.repository.PassportApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PassportApplicationService Tests")
class PassportApplicationServiceTest {

    @Mock
    private PassportApplicationRepository applicationRepository;

    @Mock
    private ApplicationMapper applicationMapper;

    @InjectMocks
    private PassportApplicationService applicationService;

    private CreateApplicationRequestV1 validRequest;
    private PassportApplication mappedApplication;
    private PassportApplication savedApplication;

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

        mappedApplication = new PassportApplication();
        mappedApplication.setDateOfBirth("1990-05-15");
        mappedApplication.setPreviousPassport("yes");
        mappedApplication.setAddressLine1("123 Main Street");
        mappedApplication.setAddressLine2("Apt 4B");
        mappedApplication.setTownCity("London");
        mappedApplication.setPostcode("SW1A 1AA");

        savedApplication = new PassportApplication();
        savedApplication.setId(UUID.randomUUID());
        savedApplication.setDateOfBirth("1990-05-15");
        savedApplication.setPreviousPassport("yes");
        savedApplication.setAddressLine1("123 Main Street");
        savedApplication.setAddressLine2("Apt 4B");
        savedApplication.setTownCity("London");
        savedApplication.setPostcode("SW1A 1AA");
        savedApplication.setStatus(PassportApplication.ApplicationStatus.IN_PROGRESS);
        savedApplication.setCreatedAt(LocalDateTime.now());
        savedApplication.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should create application with IN_PROGRESS status")
    void createApplication_shouldSetStatusToInProgress() {
        when(applicationMapper.toEntity(validRequest)).thenReturn(mappedApplication);
        when(applicationRepository.save(any(PassportApplication.class))).thenReturn(savedApplication);

        PassportApplication result = applicationService.createApplication(validRequest);

        assertThat(result.getStatus()).isEqualTo(PassportApplication.ApplicationStatus.IN_PROGRESS);
    }

    @Test
    @DisplayName("Should set createdAt timestamp when creating application")
    void createApplication_shouldSetCreatedAtTimestamp() {
        when(applicationMapper.toEntity(validRequest)).thenReturn(mappedApplication);
        when(applicationRepository.save(any(PassportApplication.class))).thenAnswer(invocation -> {
            PassportApplication app = invocation.getArgument(0);
            app.setId(UUID.randomUUID());
            return app;
        });

        LocalDateTime beforeCreate = LocalDateTime.now().minusSeconds(1);
        PassportApplication result = applicationService.createApplication(validRequest);
        LocalDateTime afterCreate = LocalDateTime.now().plusSeconds(1);

        assertThat(result.getCreatedAt()).isAfter(beforeCreate);
        assertThat(result.getCreatedAt()).isBefore(afterCreate);
    }

    @Test
    @DisplayName("Should call mapper to convert request to entity")
    void createApplication_shouldCallMapper() {
        when(applicationMapper.toEntity(validRequest)).thenReturn(mappedApplication);
        when(applicationRepository.save(any(PassportApplication.class))).thenReturn(savedApplication);

        applicationService.createApplication(validRequest);

        verify(applicationMapper, times(1)).toEntity(validRequest);
    }

    @Test
    @DisplayName("Should save application to repository")
    void createApplication_shouldSaveToRepository() {
        when(applicationMapper.toEntity(validRequest)).thenReturn(mappedApplication);
        when(applicationRepository.save(any(PassportApplication.class))).thenReturn(savedApplication);

        applicationService.createApplication(validRequest);

        verify(applicationRepository, times(1)).save(any(PassportApplication.class));
    }

    @Test
    @DisplayName("Should return saved application")
    void createApplication_shouldReturnSavedApplication() {
        when(applicationMapper.toEntity(validRequest)).thenReturn(mappedApplication);
        when(applicationRepository.save(any(PassportApplication.class))).thenReturn(savedApplication);

        PassportApplication result = applicationService.createApplication(validRequest);

        assertThat(result).isEqualTo(savedApplication);
        assertThat(result.getId()).isNotNull();
    }

    @Test
    @DisplayName("Should preserve all request fields in created application")
    void createApplication_shouldPreserveRequestFields() {
        when(applicationMapper.toEntity(validRequest)).thenReturn(mappedApplication);
        when(applicationRepository.save(any(PassportApplication.class))).thenAnswer(invocation -> {
            PassportApplication app = invocation.getArgument(0);
            app.setId(UUID.randomUUID());
            return app;
        });

        PassportApplication result = applicationService.createApplication(validRequest);

        assertThat(result.getDateOfBirth()).isEqualTo("1990-05-15");
        assertThat(result.getPreviousPassport()).isEqualTo("yes");
        assertThat(result.getAddressLine1()).isEqualTo("123 Main Street");
        assertThat(result.getAddressLine2()).isEqualTo("Apt 4B");
        assertThat(result.getTownCity()).isEqualTo("London");
        assertThat(result.getPostcode()).isEqualTo("SW1A 1AA");
    }

    @Test
    @DisplayName("Should create V2 application with parent details")
    void createApplicationV2_shouldIncludeParentDetails() {
        CreateApplicationRequestV2 requestV2 = CreateApplicationRequestV2.builder()
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

        PassportApplication mappedV2 = new PassportApplication();
        mappedV2.setDateOfBirth("2015-03-20");
        mappedV2.setParent1FullName("Jane Smith");
        mappedV2.setParent1Contact("jane@example.com");
        mappedV2.setParent2FullName("John Smith");
        mappedV2.setParent2Contact("john@example.com");

        PassportApplication savedV2 = new PassportApplication();
        savedV2.setId(UUID.randomUUID());
        savedV2.setDateOfBirth("2015-03-20");
        savedV2.setParent1FullName("Jane Smith");
        savedV2.setParent1Contact("jane@example.com");
        savedV2.setParent2FullName("John Smith");
        savedV2.setParent2Contact("john@example.com");
        savedV2.setStatus(PassportApplication.ApplicationStatus.IN_PROGRESS);
        savedV2.setCreatedAt(LocalDateTime.now());

        when(applicationMapper.toEntity(requestV2)).thenReturn(mappedV2);
        when(applicationRepository.save(any(PassportApplication.class))).thenReturn(savedV2);

        PassportApplication result = applicationService.createApplication(requestV2);

        assertThat(result.getParent1FullName()).isEqualTo("Jane Smith");
        assertThat(result.getParent1Contact()).isEqualTo("jane@example.com");
        assertThat(result.getParent2FullName()).isEqualTo("John Smith");
        assertThat(result.getParent2Contact()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("Should handle V2 application with only one parent")
    void createApplicationV2_shouldHandleSingleParent() {
        CreateApplicationRequestV2 requestV2 = CreateApplicationRequestV2.builder()
                .dateOfBirth("2015-03-20")
                .addressLine1("456 Park Avenue")
                .townCity("Manchester")
                .postcode("M1 2WD")
                .parent1FullName("Jane Smith")
                .parent1Contact("jane@example.com")
                .build();

        PassportApplication mappedV2 = new PassportApplication();
        mappedV2.setParent1FullName("Jane Smith");
        mappedV2.setParent1Contact("jane@example.com");

        when(applicationMapper.toEntity(requestV2)).thenReturn(mappedV2);
        when(applicationRepository.save(any(PassportApplication.class))).thenAnswer(invocation -> {
            PassportApplication app = invocation.getArgument(0);
            app.setId(UUID.randomUUID());
            return app;
        });

        PassportApplication result = applicationService.createApplication(requestV2);

        assertThat(result.getParent1FullName()).isEqualTo("Jane Smith");
        assertThat(result.getParent1Contact()).isEqualTo("jane@example.com");
        assertThat(result.getParent2FullName()).isNull();
        assertThat(result.getParent2Contact()).isNull();
    }
}
