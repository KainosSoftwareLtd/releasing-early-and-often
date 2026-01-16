package com.kainos.passport.service;

import com.kainos.passport.dto.CreateApplicationRequest;
import com.kainos.passport.entity.PassportApplication;
import com.kainos.passport.repository.PassportApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PassportApplicationService {

    @Autowired
    private PassportApplicationRepository applicationRepository;

    public PassportApplication createApplication(CreateApplicationRequest request) {
        PassportApplication application = new PassportApplication();

        // Set the provided fields
        application.setDateOfBirth(request.getDateOfBirth());
        application.setPreviousPassport(request.getPreviousPassport());
        application.setAddressLine1(request.getAddressLine1());
        application.setAddressLine2(request.getAddressLine2());
        application.setTownCity(request.getTownCity());
        application.setPostcode(request.getPostcode());

        return applicationRepository.save(application);
    }
}