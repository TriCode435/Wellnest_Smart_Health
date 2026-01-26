package com.wellnest.service;

import com.wellnest.dto.MealDTO;
import com.wellnest.dto.TrainerProfileDTO;
import com.wellnest.dto.UserProfileDTO;
import com.wellnest.dto.WorkoutDTO;
import com.wellnest.entity.*;
import com.wellnest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainerService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private TrainerProfileRepository trainerProfileRepository;

        @Autowired
        private AssignmentRepository mappingRepository;

        @Autowired
        private UserProfileRepository userProfileRepository;

        @Autowired
        private WorkoutRepository workoutRepository;

        @Autowired
        private MealRepository mealRepository;

        @Autowired
        @org.springframework.context.annotation.Lazy
        private UserService userService;

        public List<UserProfileDTO> getAssignedUsers(String trainerUsername) {
                User trainer = userRepository.findByUsername(trainerUsername)
                                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                List<Assignment> assignments = mappingRepository.findByTrainer(trainer);

                return assignments.stream().map(a -> userService.getProfile(a.getUser().getUsername()))
                                .collect(Collectors.toList());
        }

        public void assignWorkout(String trainerUsername, Long userId, WorkoutDTO dto) {
                User trainer = userRepository.findByUsername(trainerUsername)
                                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                UserProfile userProfile = userProfileRepository.findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException("User profile not found"));

                Workout workout = Workout.builder()
                                .assignedByTrainer(trainer)
                                .profile(userProfile)
                                .workoutName(dto.getWorkoutName())
                                .targetReps(dto.getTargetReps())
                                .targetTime(dto.getTargetTime())
                                .date(dto.getDate())
                                .completed(false)
                                .build();

                workoutRepository.save(workout);
        }

        public void assignMeal(MealDTO dto, Long userId) {
                UserProfile userProfile = userProfileRepository.findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException("User profile not found"));

                Meal meal = Meal.builder()
                                .profile(userProfile)
                                .protein(dto.getProtein())
                                .carbs(dto.getCarbs())
                                .fats(dto.getFats())
                                .calories(dto.getCalories())
                                .date(dto.getDate())
                                .build();

                mealRepository.save(meal);
        }

        public TrainerProfileDTO getTrainerProfile(String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                TrainerProfile profile = trainerProfileRepository.findByUser(user)
                                .orElseGet(() -> trainerProfileRepository
                                                .save(TrainerProfile.builder().user(user).build()));

                TrainerProfileDTO dto = new TrainerProfileDTO();
                dto.setId(user.getId());
                dto.setSpecialization(profile.getSpecialization());
                dto.setAvailableHoursPerDay(profile.getAvailableHoursPerDay());
                dto.setExperienceYears(profile.getExperienceYears());
                return dto;
        }

        public void updateTrainerProfile(String username, TrainerProfileDTO dto) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                TrainerProfile profile = trainerProfileRepository.findByUser(user)
                                .orElseGet(() -> TrainerProfile.builder().user(user).build());

                profile.setSpecialization(dto.getSpecialization());
                profile.setAvailableHoursPerDay(dto.getAvailableHoursPerDay());
                profile.setExperienceYears(dto.getExperienceYears());
                trainerProfileRepository.save(profile);
        }

        public UserProfileDTO getAthleteProfile(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return userService.getProfile(user.getUsername());
        }
}
