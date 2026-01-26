package com.wellnest.controller;

import com.wellnest.dto.MealDTO;
import com.wellnest.dto.SleepMoodDTO;
import com.wellnest.dto.UserProfileDTO;
import com.wellnest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileDTO dto, Authentication authentication) {
        userService.updateProfile(authentication.getName(), dto);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping("/workouts")
    public ResponseEntity<?> getWorkouts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getWorkouts(authentication.getName(), date, startDate, endDate));
    }

    @PostMapping("/workouts/{id}/log")
    public ResponseEntity<?> logWorkout(@PathVariable Long id, @RequestParam Integer actualReps,
            @RequestParam Boolean completed) {
        userService.logWorkout(id, actualReps, completed);
        return ResponseEntity.ok("Workout logged successfully");
    }

    @GetMapping("/meals")
    public ResponseEntity<?> getMeals(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getMeals(authentication.getName(), date, startDate, endDate));
    }

    @PostMapping("/meals")
    public ResponseEntity<?> logMeal(@RequestBody MealDTO dto, Authentication authentication) {
        userService.logMeal(dto, authentication.getName());
        return ResponseEntity.ok("Meal logged successfully");
    }

    @GetMapping("/sleep-mood")
    public ResponseEntity<?> getSleepMood(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getSleepMood(authentication.getName(), date, startDate, endDate));
    }

    @PostMapping("/sleep-mood")
    public ResponseEntity<?> logSleepMood(@RequestBody SleepMoodDTO dto, Authentication authentication) {
        userService.logSleepMood(dto, authentication.getName());
        return ResponseEntity.ok("Sleep & Mood logged successfully");
    }

    @GetMapping("/assigned-trainer")
    public ResponseEntity<?> getAssignedTrainer(Authentication authentication) {
        return ResponseEntity.ok(userService.getAssignedTrainer(authentication.getName()));
    }
}
