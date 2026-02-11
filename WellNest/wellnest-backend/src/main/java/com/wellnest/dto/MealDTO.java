package com.wellnest.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MealDTO {
    private Long id;
    private Double protein;
    private Double carbs;
    private Double fats;
    private Double calories;
    private Double waterIntake;
    private LocalDate date;
}
