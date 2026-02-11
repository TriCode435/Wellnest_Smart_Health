package com.wellnest.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class WorkoutDTO {
    private Long id;
    private String workoutName;
    private Integer targetReps;
    private String targetTime;
    private Integer actualReps;
    private Boolean completed;
    private LocalDate date;
}
