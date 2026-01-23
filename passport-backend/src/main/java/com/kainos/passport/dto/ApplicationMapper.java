package com.kainos.passport.dto;

import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationV1.ApplicationResponseV1;
import com.kainos.passport.entity.PassportApplication;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {

    // Map V1 request to entity
    public PassportApplication toEntity(CreateApplicationRequestV1 request) {
        PassportApplication application = new PassportApplication();

        application.setDateOfBirth(request.getDateOfBirth());
        application.setPreviousPassport(request.getPreviousPassport());
        application.setAddressLine1(request.getAddressLine1());
        application.setAddressLine2(request.getAddressLine2());
        application.setTownCity(request.getTownCity());
        application.setPostcode(request.getPostcode());

        return application;
    }

    // Map entity to V1 response
    public ApplicationResponseV1 toV1(PassportApplication application) {
        ApplicationResponseV1.ApplicationData appData = ApplicationResponseV1.ApplicationData.builder()
                .dateOfBirth(application.getDateOfBirth())
                .previousPassport(application.getPreviousPassport())
                .addressLine1(application.getAddressLine1())
                .addressLine2(application.getAddressLine2())
                .townCity(application.getTownCity())
                .postcode(application.getPostcode())
                .build();

        return ApplicationResponseV1.builder()
                .applicationId(application.getId())
                .status(application.getStatus().toString())
                .createdAt(application.getCreatedAt())
                .application(appData)
                .build();
    }
}
