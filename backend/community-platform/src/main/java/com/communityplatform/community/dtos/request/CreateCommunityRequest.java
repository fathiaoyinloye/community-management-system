package com.communityplatform.community.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCommunityRequest {

    @NotBlank(message = "Community name is required")
    private String name;

    @NotBlank(message = "Community type is required")
    private String type;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "LGA is required")
    private String lga;

    @NotBlank(message = "State is required")
    private String state;

    private String phone;
    private String email;
    private String description;
}