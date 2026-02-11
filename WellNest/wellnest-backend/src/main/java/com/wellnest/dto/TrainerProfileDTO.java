package com.wellnest.dto;

import lombok.Data;

@Data
public class TrainerProfileDTO {
    private Long id;
    private String username;
    private String specialization;
    private Integer availableHoursPerDay;
    private Integer experienceYears;
}
