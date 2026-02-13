package com.kainos.passport.dto;

import com.kainos.passport.dto.applicationV1.ApplicationResponseV1;
import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationV2.ApplicationResponseV2;
import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
import com.kainos.passport.entity.PassportApplication;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ApplicationMapper Tests")
class ApplicationMapperTest {

    private ApplicationMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new ApplicationMapper();
    }

    @Nested
    @DisplayName("toEntity() - V1 Request to Entity")
    class ToEntityTests {

        @Test
        @DisplayName("Should map all fields from request to entity")
        void toEntity_shouldMapAllFields() {
            CreateApplicationRequestV1 request = CreateApplicationRequestV1.builder()
                    .dateOfBirth("1990-05-15")
                    .previousPassport("yes")
                    .addressLine1("123 Main Street")
                    .addressLine2("Apt 4B")
                    .townCity("London")
                    .postcode("SW1A 1AA")
                    .build();

            PassportApplication entity = mapper.toEntity(request);

            assertThat(entity.getDateOfBirth()).isEqualTo("1990-05-15");
            assertThat(entity.getPreviousPassport()).isEqualTo("yes");
            assertThat(entity.getAddressLine1()).isEqualTo("123 Main Street");
            assertThat(entity.getAddressLine2()).isEqualTo("Apt 4B");
            assertThat(entity.getTownCity()).isEqualTo("London");
            assertThat(entity.getPostcode()).isEqualTo("SW1A 1AA");
        }

        @Test
        @DisplayName("Should handle null optional fields")
        void toEntity_shouldHandleNullOptionalFields() {
            CreateApplicationRequestV1 request = CreateApplicationRequestV1.builder()
                    .dateOfBirth("1990-05-15")
                    .addressLine1("123 Main Street")
                    .townCity("London")
                    .postcode("SW1A 1AA")
                    .build();

            PassportApplication entity = mapper.toEntity(request);

            assertThat(entity.getPreviousPassport()).isNull();
            assertThat(entity.getAddressLine2()).isNull();
        }

        @Test
        @DisplayName("Should not set system fields (id, status, timestamps)")
        void toEntity_shouldNotSetSystemFields() {
            CreateApplicationRequestV1 request = CreateApplicationRequestV1.builder()
                    .dateOfBirth("1990-05-15")
                    .addressLine1("123 Main Street")
                    .townCity("London")
                    .postcode("SW1A 1AA")
                    .build();

            PassportApplication entity = mapper.toEntity(request);

            assertThat(entity.getId()).isNull();
            assertThat(entity.getStatus()).isNull();
            assertThat(entity.getCreatedAt()).isNull();
            assertThat(entity.getUpdatedAt()).isNull();
        }
    }

    @Nested
    @DisplayName("toV1() - Entity to V1 Response")
    class ToV1Tests {

        private PassportApplication application;
        private UUID applicationId;
        private LocalDateTime createdAt;

        @BeforeEach
        void setUp() {
            applicationId = UUID.randomUUID();
            createdAt = LocalDateTime.of(2026, 2, 10, 10, 30, 0);

            application = new PassportApplication();
            application.setId(applicationId);
            application.setStatus(PassportApplication.ApplicationStatus.IN_PROGRESS);
            application.setCreatedAt(createdAt);
            application.setUpdatedAt(createdAt);
            application.setDateOfBirth("1990-05-15");
            application.setPreviousPassport("yes");
            application.setAddressLine1("123 Main Street");
            application.setAddressLine2("Apt 4B");
            application.setTownCity("London");
            application.setPostcode("SW1A 1AA");
        }

        @Test
        @DisplayName("Should map applicationId from entity")
        void toV1_shouldMapApplicationId() {
            ApplicationResponseV1 response = mapper.toV1(application);

            assertThat(response.getApplicationId()).isEqualTo(applicationId);
        }

        @Test
        @DisplayName("Should map status as string")
        void toV1_shouldMapStatusAsString() {
            ApplicationResponseV1 response = mapper.toV1(application);

            assertThat(response.getStatus()).isEqualTo("IN_PROGRESS");
        }

        @Test
        @DisplayName("Should map createdAt timestamp")
        void toV1_shouldMapCreatedAt() {
            ApplicationResponseV1 response = mapper.toV1(application);

            assertThat(response.getCreatedAt()).isEqualTo(createdAt);
        }

        @Test
        @DisplayName("Should map all application data fields")
        void toV1_shouldMapApplicationDataFields() {
            ApplicationResponseV1 response = mapper.toV1(application);

            assertThat(response.getApplication()).isNotNull();
            assertThat(response.getApplication().getDateOfBirth()).isEqualTo("1990-05-15");
            assertThat(response.getApplication().getPreviousPassport()).isEqualTo("yes");
            assertThat(response.getApplication().getAddressLine1()).isEqualTo("123 Main Street");
            assertThat(response.getApplication().getAddressLine2()).isEqualTo("Apt 4B");
            assertThat(response.getApplication().getTownCity()).isEqualTo("London");
            assertThat(response.getApplication().getPostcode()).isEqualTo("SW1A 1AA");
        }

        @Test
        @DisplayName("Should handle different status values")
        void toV1_shouldHandleDifferentStatusValues() {
            application.setStatus(PassportApplication.ApplicationStatus.SUBMITTED);

            ApplicationResponseV1 response = mapper.toV1(application);

            assertThat(response.getStatus()).isEqualTo("SUBMITTED");
        }

        @Test
        @DisplayName("Should handle COMPLETED status")
        void toV1_shouldHandleCompletedStatus() {
            application.setStatus(PassportApplication.ApplicationStatus.COMPLETED);

            ApplicationResponseV1 response = mapper.toV1(application);

            assertThat(response.getStatus()).isEqualTo("COMPLETED");
        }

        @Test
        @DisplayName("Should handle null optional fields in application data")
        void toV1_shouldHandleNullOptionalFields() {
            application.setPreviousPassport(null);
            application.setAddressLine2(null);

            ApplicationResponseV1 response = mapper.toV1(application);

            assertThat(response.getApplication().getPreviousPassport()).isNull();
            assertThat(response.getApplication().getAddressLine2()).isNull();
        }
    }

    @Nested
    @DisplayName("toEntity() - V2 Request to Entity")
    class ToEntityV2Tests {

        @Test
        @DisplayName("Should map all V2 fields including parent details from request to entity")
        void toEntityV2_shouldMapAllFields() {
            CreateApplicationRequestV2 request = CreateApplicationRequestV2.builder()
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

            PassportApplication entity = mapper.toEntity(request);

            assertThat(entity.getDateOfBirth()).isEqualTo("2015-03-20");
            assertThat(entity.getPreviousPassport()).isEqualTo("no");
            assertThat(entity.getAddressLine1()).isEqualTo("456 Park Avenue");
            assertThat(entity.getAddressLine2()).isEqualTo("Suite 10");
            assertThat(entity.getTownCity()).isEqualTo("Manchester");
            assertThat(entity.getPostcode()).isEqualTo("M1 2WD");
            assertThat(entity.getParent1FullName()).isEqualTo("Jane Smith");
            assertThat(entity.getParent1Contact()).isEqualTo("jane@example.com");
            assertThat(entity.getParent2FullName()).isEqualTo("John Smith");
            assertThat(entity.getParent2Contact()).isEqualTo("john@example.com");
        }

        @Test
        @DisplayName("Should handle optional parent2 fields as null")
        void toEntityV2_shouldHandleNullParent2Fields() {
            CreateApplicationRequestV2 request = CreateApplicationRequestV2.builder()
                    .dateOfBirth("2015-03-20")
                    .addressLine1("456 Park Avenue")
                    .townCity("Manchester")
                    .postcode("M1 2WD")
                    .parent1FullName("Jane Smith")
                    .parent1Contact("jane@example.com")
                    .build();

            PassportApplication entity = mapper.toEntity(request);

            assertThat(entity.getParent1FullName()).isEqualTo("Jane Smith");
            assertThat(entity.getParent1Contact()).isEqualTo("jane@example.com");
            assertThat(entity.getParent2FullName()).isNull();
            assertThat(entity.getParent2Contact()).isNull();
        }

        @Test
        @DisplayName("Should not set system fields when mapping V2 request")
        void toEntityV2_shouldNotSetSystemFields() {
            CreateApplicationRequestV2 request = CreateApplicationRequestV2.builder()
                    .dateOfBirth("2015-03-20")
                    .addressLine1("456 Park Avenue")
                    .townCity("Manchester")
                    .postcode("M1 2WD")
                    .parent1FullName("Jane Smith")
                    .parent1Contact("jane@example.com")
                    .build();

            PassportApplication entity = mapper.toEntity(request);

            assertThat(entity.getId()).isNull();
            assertThat(entity.getStatus()).isNull();
            assertThat(entity.getCreatedAt()).isNull();
            assertThat(entity.getUpdatedAt()).isNull();
        }
    }

    @Nested
    @DisplayName("toV2() - Entity to V2 Response")
    class ToV2Tests {

        private PassportApplication application;
        private UUID applicationId;
        private LocalDateTime createdAt;

        @BeforeEach
        void setUp() {
            applicationId = UUID.randomUUID();
            createdAt = LocalDateTime.of(2026, 2, 10, 10, 30, 0);

            application = new PassportApplication();
            application.setId(applicationId);
            application.setStatus(PassportApplication.ApplicationStatus.IN_PROGRESS);
            application.setCreatedAt(createdAt);
            application.setUpdatedAt(createdAt);
            application.setDateOfBirth("2015-03-20");
            application.setPreviousPassport("no");
            application.setAddressLine1("456 Park Avenue");
            application.setAddressLine2("Suite 10");
            application.setTownCity("Manchester");
            application.setPostcode("M1 2WD");
            application.setParent1FullName("Jane Smith");
            application.setParent1Contact("jane@example.com");
            application.setParent2FullName("John Smith");
            application.setParent2Contact("john@example.com");
        }

        @Test
        @DisplayName("Should map all fields including parent details to V2 response")
        void toV2_shouldMapAllFields() {
            ApplicationResponseV2 response = mapper.toV2(application);

            assertThat(response.getApplicationId()).isEqualTo(applicationId);
            assertThat(response.getStatus()).isEqualTo("IN_PROGRESS");
            assertThat(response.getCreatedAt()).isEqualTo(createdAt);
            assertThat(response.getApplication()).isNotNull();
            assertThat(response.getApplication().getDateOfBirth()).isEqualTo("2015-03-20");
            assertThat(response.getApplication().getPreviousPassport()).isEqualTo("no");
            assertThat(response.getApplication().getAddressLine1()).isEqualTo("456 Park Avenue");
            assertThat(response.getApplication().getAddressLine2()).isEqualTo("Suite 10");
            assertThat(response.getApplication().getTownCity()).isEqualTo("Manchester");
            assertThat(response.getApplication().getPostcode()).isEqualTo("M1 2WD");
            assertThat(response.getApplication().getParent1FullName()).isEqualTo("Jane Smith");
            assertThat(response.getApplication().getParent1Contact()).isEqualTo("jane@example.com");
            assertThat(response.getApplication().getParent2FullName()).isEqualTo("John Smith");
            assertThat(response.getApplication().getParent2Contact()).isEqualTo("john@example.com");
        }

        @Test
        @DisplayName("Should handle null parent2 fields in V2 response")
        void toV2_shouldHandleNullParent2Fields() {
            application.setParent2FullName(null);
            application.setParent2Contact(null);

            ApplicationResponseV2 response = mapper.toV2(application);

            assertThat(response.getApplication().getParent1FullName()).isEqualTo("Jane Smith");
            assertThat(response.getApplication().getParent1Contact()).isEqualTo("jane@example.com");
            assertThat(response.getApplication().getParent2FullName()).isNull();
            assertThat(response.getApplication().getParent2Contact()).isNull();
        }

        @Test
        @DisplayName("Should map different status values in V2 response")
        void toV2_shouldMapDifferentStatusValues() {
            application.setStatus(PassportApplication.ApplicationStatus.SUBMITTED);

            ApplicationResponseV2 response = mapper.toV2(application);

            assertThat(response.getStatus()).isEqualTo("SUBMITTED");
        }
    }
}
