package com.kainos.passport.dto.applicationV2;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ApplicationResponseV2 {

	private UUID applicationId;
	private String status;
	private LocalDateTime createdAt;

	// Application payload with parent details
	private ApplicationData application;

	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	@ToString
	public static class ApplicationData {
		private String dateOfBirth;
		private String previousPassport;
		private String addressLine1;
		private String addressLine2;
		private String townCity;
		private String postcode;

		// Parent details (v2 specific)
		private String parent1FullName;
		private String parent1Contact;
		private String parent2FullName;
		private String parent2Contact;
	}
}
