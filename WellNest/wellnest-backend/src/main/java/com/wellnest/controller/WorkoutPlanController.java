package com.wellnest.controller;

import com.wellnest.entity.User;
import com.wellnest.entity.WorkoutPlan;
import com.wellnest.repository.UserRepository;
import com.wellnest.repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/workout-plans")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAllPlans() {
        return ResponseEntity.ok(workoutPlanRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createPlan(@RequestBody WorkoutPlan plan, Authentication authentication) {
        User trainer = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        plan.setTrainer(trainer);
        plan.setCreatedAt(LocalDate.now());
        return ResponseEntity.ok(workoutPlanRepository.save(plan));
    }
}
