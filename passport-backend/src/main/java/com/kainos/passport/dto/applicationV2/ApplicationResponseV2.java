package com.kainos.passport.dto.applicationV2;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponseV2 {

    private UUID applicationId;
    private String status;
    private LocalDateTime createdAt;
    private ApplicationData application;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicationData {
        private String dateOfBirth;
        private String previousPassport;
        private String addressLine1;
        private String addressLine2;
        private String townCity;
        private String postcode;
        private String parent1FullName;
        private String parent1Contact;
        private String parent2FullName;
        private String parent2Contact;
    }
}