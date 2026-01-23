package com.kainos.passport.dto.applicationV1;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CreateApplicationRequestV1 {

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
}