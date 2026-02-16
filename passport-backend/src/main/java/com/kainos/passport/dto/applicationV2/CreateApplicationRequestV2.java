package com.kainos.passport.dto.applicationV2;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CreateApplicationRequestV2 {

	@NotBlank(message = "Date of birth is required")
	private String dateOfBirth;

	private String previousPassport;

	@NotBlank(message = "Address line 1 is required")
	private String addressLine1;

	private String addressLine2; // Optional field

	@NotBlank(message = "Town/City is required")
	private String townCity;

	@NotBlank(message = "Postcode is required")
	private String postcode;

	// Parent details (v2 specific fields)
	@NotBlank(message = "Parent 1 full name is required")
	private String parent1FullName;

	@NotBlank(message = "Parent 1 contact is required")
	private String parent1Contact;

	// Parent 2 is optional
	private String parent2FullName;
	private String parent2Contact;
}
