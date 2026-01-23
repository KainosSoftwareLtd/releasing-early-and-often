package com.kainos.passport.dto.applicationV1;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ApplicationResponseV1 {

    private UUID applicationId;
    private String status;
    private LocalDateTime createdAt;

    // Application payload
    private ApplicationData application;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ToString
    public static class ApplicationData {
        private String dateOfBirth;
        private String previousPassport;
        private String addressLine1;
        private String addressLine2;
        private String townCity;
        private String postcode;
    }
}