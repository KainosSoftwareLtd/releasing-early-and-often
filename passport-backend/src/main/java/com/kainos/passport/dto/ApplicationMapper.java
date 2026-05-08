package com.kainos.passport.dto;

import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationV1.ApplicationResponseV1;
import com.kainos.passport.dto.applicationV2.ApplicationResponseV2;
import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
import com.kainos.passport.entity.PassportApplication;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {

    // Map V1 request to entity
    public PassportApplication toEntity(CreateApplicationRequestV1 request) {
        return toEntity(
                request.getDateOfBirth(),
                request.getPreviousPassport(),
                request.getAddressLine1(),
                request.getAddressLine2(),
                request.getTownCity(),
                request.getPostcode());
    }

    public PassportApplication toEntity(CreateApplicationRequestV2 request) {
        return toEntity(
                request.getDateOfBirth(),
                request.getPreviousPassport(),
                request.getAddressLine1(),
                request.getAddressLine2(),
                request.getTownCity(),
                request.getPostcode());
    }

    private PassportApplication toEntity(
            String dateOfBirth,
            String previousPassport,
            String addressLine1,
            String addressLine2,
            String townCity,
            String postcode) {
        PassportApplication application = new PassportApplication();

        application.setDateOfBirth(dateOfBirth);
        application.setPreviousPassport(previousPassport);
        application.setAddressLine1(addressLine1);
        application.setAddressLine2(addressLine2);
        application.setTownCity(townCity);
        application.setPostcode(postcode);

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

    public ApplicationResponseV2 toV2(PassportApplication application, CreateApplicationRequestV2 request) {
        ApplicationResponseV2.ApplicationData appData = ApplicationResponseV2.ApplicationData.builder()
                .dateOfBirth(application.getDateOfBirth())
                .previousPassport(application.getPreviousPassport())
                .addressLine1(application.getAddressLine1())
                .addressLine2(application.getAddressLine2())
                .townCity(application.getTownCity())
                .postcode(application.getPostcode())
                .parent1FullName(request.getParent1FullName())
                .parent1Contact(request.getParent1Contact())
                .parent2FullName(request.getParent2FullName())
                .parent2Contact(request.getParent2Contact())
                .build();

        return ApplicationResponseV2.builder()
                .applicationId(application.getId())
                .status(application.getStatus().toString())
                .createdAt(application.getCreatedAt())
                .application(appData)
                .build();
    }
}
