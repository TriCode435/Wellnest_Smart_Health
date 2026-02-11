package com.wellnest.controller;

import com.wellnest.dto.MealDTO;
import com.wellnest.dto.TrainerProfileDTO;
import com.wellnest.dto.WorkoutDTO;
import com.wellnest.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainer")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        return ResponseEntity.ok(trainerService.getTrainerProfile(authentication.getName()));
    }

    @GetMapping("/assigned-users")
    public ResponseEntity<?> getAssignedUsers(Authentication authentication) {
        return ResponseEntity.ok(trainerService.getAssignedUsers(authentication.getName()));
    }

    @GetMapping("/users/{userId}/profile")
    public ResponseEntity<?> getAthleteProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(trainerService.getAthleteProfile(userId));
    }

    @PostMapping("/users/{userId}/assign-workout")
    public ResponseEntity<?> assignWorkout(@PathVariable Long userId, @RequestBody WorkoutDTO dto,
            Authentication authentication) {
        trainerService.assignWorkout(authentication.getName(), userId, dto);
        return ResponseEntity.ok("Workout assigned successfully");
    }

    @PostMapping("/users/{userId}/assign-meal")
    public ResponseEntity<?> assignMeal(@PathVariable Long userId, @RequestBody MealDTO dto) {
        trainerService.assignMeal(dto, userId);
        return ResponseEntity.ok("Meal assigned successfully");
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody TrainerProfileDTO dto, Authentication authentication) {
        trainerService.updateTrainerProfile(authentication.getName(), dto);
        return ResponseEntity.ok("Trainer profile updated successfully");
    }
}
