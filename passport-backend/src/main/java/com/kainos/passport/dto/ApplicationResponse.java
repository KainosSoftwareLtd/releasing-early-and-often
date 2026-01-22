package com.kainos.passport.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ApplicationResponse {

    private UUID applicationId;
    private String status;
    private LocalDateTime createdAt;
}