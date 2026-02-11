package com.wellnest.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SleepMoodDTO {
    private Long id;
    private Double sleepHours;
    private String mood;
    private Integer stressLevel;
    private LocalDate date;
}
