package com.kainos.passport.controller;

import com.kainos.passport.dto.ApplicationMapper;
import com.kainos.passport.dto.applicationV1.ApplicationResponseV1;
import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationV2.ApplicationResponseV2;
import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
import com.kainos.passport.entity.PassportApplication;
import com.kainos.passport.service.PassportApplicationService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Passport Applications", description = "API for managing passport applications")
public class PassportApplicationController {

    @Value("${feature.child-renewals.enabled}")
    private boolean childRenewalsEnabled;

    @Autowired
    private PassportApplicationService applicationService;

    @Autowired
    private ApplicationMapper applicationMapper;

    @Operation(
        summary = "Create a new passport application (v1.0)",
        description = "Creates a new passport application with basic details and returns an application ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Application created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(path = "/applications", version = "1.0")
    public ResponseEntity<ApplicationResponseV1> createApplicationV1(@Valid @RequestBody CreateApplicationRequestV1 request) {
        try {
            PassportApplication application = applicationService.createApplication(request);
            ApplicationResponseV1 response = applicationMapper.toV1(application);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(
        summary = "Create a new passport application (v2.0)",
        description = "Creates a new passport application with parent details and returns an application ID with parent information"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Application created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data or missing parent details"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(path = "/applications", version = "2.0")
    public ResponseEntity<ApplicationResponseV2> createApplicationV2(@Valid @RequestBody CreateApplicationRequestV2 request) {
        if (!childRenewalsEnabled) {
            return ResponseEntity.notFound().build();
        }
        try {
            PassportApplication application = applicationService.createApplication(request);
            ApplicationResponseV2 response = applicationMapper.toV2(application);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}