package com.kainos.passport.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ApplicationResponse {

    private UUID applicationId;
    private String status;
    private LocalDateTime createdAt;

    public ApplicationResponse() {}

    public ApplicationResponse(UUID applicationId, String status, LocalDateTime createdAt) {
        this.applicationId = applicationId;
        this.status = status;
        this.createdAt = createdAt;
    }

    public UUID getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(UUID applicationId) {
        this.applicationId = applicationId;
    }

    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}