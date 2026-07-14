package com.communityplatform.house.dtos.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterHouseRequest {

    @NotBlank(message = "House number is required")
    private String houseNumber;

    @NotBlank(message = "Street is required")
    private String street;
}