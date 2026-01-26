package com.wellnest.controller;

import com.wellnest.entity.Assignment;
import com.wellnest.entity.User;
import com.wellnest.repository.AssignmentRepository;
import com.wellnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignTrainer(@RequestParam Long trainerId, @RequestParam Long userId) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer with ID " + trainerId + " not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

        if (!trainer.getRole().name().equals("TRAINER"))
            throw new RuntimeException(
                    "User with ID " + trainerId + " is not a TRAINER. Current role: " + trainer.getRole());
        if (!user.getRole().name().equals("USER"))
            throw new RuntimeException(
                    "User with ID " + userId + " is not a regular USER. Current role: " + user.getRole());

        Assignment assignment = Assignment.builder()
                .trainer(trainer)
                .user(user)
                .assignedDate(LocalDate.now())
                .build();

        return ResponseEntity.ok(assignmentRepository.save(assignment));
    }

    @GetMapping("/assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllAssignments() {
        return ResponseEntity.ok(assignmentRepository.findAll());
    }
}
