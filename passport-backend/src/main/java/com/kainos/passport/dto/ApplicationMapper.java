package com.kainos.passport.dto;

import com.kainos.passport.dto.applicationV1.CreateApplicationRequestV1;
import com.kainos.passport.dto.applicationV2.ApplicationResponseV2;
import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
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
		// Parent fields remain null for v1

		return application;
	}

	// Map V2 request to entity
	public PassportApplication toEntity(CreateApplicationRequestV2 request) {
		PassportApplication application = new PassportApplication();

		application.setDateOfBirth(request.getDateOfBirth());
		application.setPreviousPassport(request.getPreviousPassport());
		application.setAddressLine1(request.getAddressLine1());
		application.setAddressLine2(request.getAddressLine2());
		application.setTownCity(request.getTownCity());
		application.setPostcode(request.getPostcode());

		// V2 specific: set parent details
		application.setParent1FullName(request.getParent1FullName());
		application.setParent1Contact(request.getParent1Contact());
		application.setParent2FullName(request.getParent2FullName());
		application.setParent2Contact(request.getParent2Contact());

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

	// Map entity to V2 response
	public ApplicationResponseV2 toV2(PassportApplication application) {
		ApplicationResponseV2.ApplicationData appData = ApplicationResponseV2.ApplicationData.builder()
				.dateOfBirth(application.getDateOfBirth())
				.previousPassport(application.getPreviousPassport())
				.addressLine1(application.getAddressLine1())
				.addressLine2(application.getAddressLine2())
				.townCity(application.getTownCity())
				.postcode(application.getPostcode())
				// V2 specific: include parent details
				.parent1FullName(application.getParent1FullName())
				.parent1Contact(application.getParent1Contact())
				.parent2FullName(application.getParent2FullName())
				.parent2Contact(application.getParent2Contact())
				.build();

		return ApplicationResponseV2.builder()
				.applicationId(application.getId())
				.status(application.getStatus().toString())
				.createdAt(application.getCreatedAt())
				.application(appData)
				.build();
	}
}
