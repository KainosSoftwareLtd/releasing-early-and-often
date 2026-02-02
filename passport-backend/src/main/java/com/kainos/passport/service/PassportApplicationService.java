package com.kainos.passport.service;

import com.kainos.passport.dto.ApplicationMapper;
import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
import com.kainos.passport.entity.PassportApplication;
import com.kainos.passport.repository.PassportApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PassportApplicationService {

    @Autowired
    private PassportApplicationRepository applicationRepository;

    @Autowired
    private ApplicationMapper applicationMapper;

    // V1 API: Create application with basic details
    public PassportApplication createApplication(CreateApplicationRequestV1 request) {
        PassportApplication application = applicationMapper.toEntity(request);

        // Set system fields
        application.setCreatedAt(LocalDateTime.now());
        application.setStatus(PassportApplication.ApplicationStatus.IN_PROGRESS);

        return applicationRepository.save(application);
    }

    // V2 API: Create application with parent details
    public PassportApplication createApplication(CreateApplicationRequestV2 request) {
        PassportApplication application = applicationMapper.toEntity(request);

        // Set system fields
        application.setCreatedAt(LocalDateTime.now());
        application.setStatus(PassportApplication.ApplicationStatus.IN_PROGRESS);

        return applicationRepository.save(application);
    }
}