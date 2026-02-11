package com.wellnest.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String username;
    private String fullName;
    private Integer age;
    private String gender;
    private Double height;
    private Double weight;
    private String fitnessGoal;
    private String medicalNotes;
}
