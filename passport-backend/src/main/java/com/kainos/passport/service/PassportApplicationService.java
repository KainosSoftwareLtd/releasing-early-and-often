package com.kainos.passport.service;

import com.kainos.passport.dto.ApplicationMapper;
import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
import com.kainos.passport.entity.PassportApplication;
import com.kainos.passport.repository.ParentDetailsStore;
import com.kainos.passport.repository.PassportApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PassportApplicationService {

    @Autowired
    private PassportApplicationRepository applicationRepository;

    @Autowired
    private ApplicationMapper applicationMapper;

    @Autowired
    private ParentDetailsStore parentDetailsStore;

    // V1 API: Create application with basic details
    @Transactional
    public PassportApplication createApplication(CreateApplicationRequestV1 request) {
        PassportApplication application = applicationMapper.toEntity(request);

        return saveApplication(application);
    }

    @Transactional
    public PassportApplication createApplication(CreateApplicationRequestV2 request) {
        PassportApplication application = applicationMapper.toEntity(request);
        PassportApplication savedApplication = saveApplication(application);

        parentDetailsStore.save(savedApplication.getId(), request);

        return savedApplication;
    }

    private PassportApplication saveApplication(PassportApplication application) {

        // Set system fields
        application.setCreatedAt(LocalDateTime.now());
        application.setStatus(PassportApplication.ApplicationStatus.IN_PROGRESS);

        return applicationRepository.saveAndFlush(application);
    }
}