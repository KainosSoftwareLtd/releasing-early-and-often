package com.kainos.passport.controller;

import com.kainos.passport.dto.ApplicationResponse;
import com.kainos.passport.dto.CreateApplicationRequest;
import com.kainos.passport.entity.PassportApplication;
import com.kainos.passport.service.PassportApplicationService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Passport Applications", description = "API for managing passport applications")
public class PassportApplicationController {

    @Autowired
    private PassportApplicationService applicationService;

    @Operation(summary = "Create a new passport application",
               description = "Creates a new passport application with provided details and returns an application ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Application created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(path = "/applications", version = "1.0")
    public ResponseEntity<ApplicationResponse> createApplication(@Valid @RequestBody CreateApplicationRequest request) {
        try {
            PassportApplication application = applicationService.createApplication(request);

            ApplicationResponse response = new ApplicationResponse(
                application.getId(),
                application.getStatus().toString(),
                application.getCreatedAt()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}