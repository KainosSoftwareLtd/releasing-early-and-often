package com.kainos.passport.dto.applicationV2;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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

    private String addressLine2;

    @NotBlank(message = "Town/City is required")
    private String townCity;

    @NotBlank(message = "Postcode is required")
    private String postcode;

    @NotBlank(message = "Parent 1 full name is required")
    private String parent1FullName;

    @NotBlank(message = "Parent 1 contact is required")
    private String parent1Contact;

    private String parent2FullName;

    private String parent2Contact;
}