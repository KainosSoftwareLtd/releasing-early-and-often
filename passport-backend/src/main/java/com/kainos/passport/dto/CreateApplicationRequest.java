package com.kainos.passport.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateApplicationRequest {

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

    public CreateApplicationRequest() {}

    public CreateApplicationRequest(String dateOfBirth, String previousPassport,
                                  String addressLine1, String addressLine2,
                                  String townCity, String postcode) {
        this.dateOfBirth = dateOfBirth;
        this.previousPassport = previousPassport;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.townCity = townCity;
        this.postcode = postcode;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPreviousPassport() {
        return previousPassport;
    }

    public void setPreviousPassport(String previousPassport) {
        this.previousPassport = previousPassport;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getTownCity() {
        return townCity;
    }

    public void setTownCity(String townCity) {
        this.townCity = townCity;
    }

    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }
}