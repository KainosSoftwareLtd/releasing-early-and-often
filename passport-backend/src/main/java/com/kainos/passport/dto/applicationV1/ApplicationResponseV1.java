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
}