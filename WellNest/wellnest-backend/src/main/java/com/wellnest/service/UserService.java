package com.wellnest.service;

import com.wellnest.dto.MealDTO;
import com.wellnest.dto.SleepMoodDTO;
import com.wellnest.dto.TrainerProfileDTO;
import com.wellnest.dto.UserProfileDTO;
import com.wellnest.dto.WorkoutDTO;
import com.wellnest.entity.*;
import com.wellnest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private SleepMoodRepository sleepMoodRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    @org.springframework.context.annotation.Lazy
    private TrainerService trainerService;

    public UserProfileDTO getProfile(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(profile.getFullName());
        dto.setAge(profile.getAge());
        dto.setGender(profile.getGender());
        dto.setHeight(profile.getHeight());
        dto.setWeight(profile.getWeight());
        dto.setFitnessGoal(profile.getFitnessGoal());
        dto.setMedicalNotes(profile.getMedicalNotes());
        return dto;
    }

    public void updateProfile(String username, UserProfileDTO dto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setFullName(dto.getFullName());
        profile.setAge(dto.getAge());
        profile.setGender(dto.getGender());
        profile.setHeight(dto.getHeight());
        profile.setWeight(dto.getWeight());
        profile.setFitnessGoal(dto.getFitnessGoal());
        profile.setMedicalNotes(dto.getMedicalNotes());
        userProfileRepository.save(profile);
    }

    public List<WorkoutDTO> getWorkouts(String username, LocalDate date, LocalDate startDate, LocalDate endDate) {
        UserProfile profile = getProfileEntity(username);
        List<Workout> workouts;
        if (startDate != null && endDate != null) {
            workouts = workoutRepository.findByProfileAndDateBetween(profile, startDate, endDate);
        } else if (date != null) {
            workouts = workoutRepository.findByProfileAndDate(profile, date);
        } else {
            workouts = workoutRepository.findByProfile(profile);
        }
        return workouts.stream().map(this::mapToWorkoutDTO).collect(Collectors.toList());
    }

    public void logWorkout(Long id, Integer actualReps, Boolean completed) {
        Workout workout = workoutRepository.findById(id).orElseThrow(() -> new RuntimeException("Workout not found"));
        workout.setActualReps(actualReps);
        workout.setCompleted(completed);
        workoutRepository.save(workout);
    }

    public List<MealDTO> getMeals(String username, LocalDate date, LocalDate startDate, LocalDate endDate) {
        UserProfile profile = getProfileEntity(username);
        List<Meal> meals;
        if (startDate != null && endDate != null) {
            meals = mealRepository.findByProfileAndDateBetween(profile, startDate, endDate);
        } else if (date != null) {
            meals = mealRepository.findByProfileAndDate(profile, date);
        } else {
            meals = mealRepository.findByProfile(profile);
        }
        return meals.stream().map(this::mapToMealDTO).collect(Collectors.toList());
    }

    public void logMeal(MealDTO dto, String username) {
        UserProfile profile = getProfileEntity(username);
        Meal meal = Meal.builder()
                .profile(profile)
                .protein(dto.getProtein())
                .carbs(dto.getCarbs())
                .fats(dto.getFats())
                .calories(dto.getCalories())
                .waterIntake(dto.getWaterIntake())
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .build();
        mealRepository.save(meal);
    }

    public List<SleepMoodDTO> getSleepMood(String username, LocalDate date, LocalDate startDate, LocalDate endDate) {
        UserProfile profile = getProfileEntity(username);
        List<SleepMood> entries;
        if (startDate != null && endDate != null) {
            entries = sleepMoodRepository.findByProfileAndDateBetween(profile, startDate, endDate);
        } else if (date != null) {
            entries = sleepMoodRepository.findByProfileAndDate(profile, date);
        } else {
            entries = sleepMoodRepository.findByProfile(profile);
        }
        return entries.stream().map(this::mapToSleepMoodDTO).collect(Collectors.toList());
    }

    public void logSleepMood(SleepMoodDTO dto, String username) {
        UserProfile profile = getProfileEntity(username);
        SleepMood entry = SleepMood.builder()
                .profile(profile)
                .sleepHours(dto.getSleepHours())
                .mood(dto.getMood())
                .stressLevel(dto.getStressLevel())
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .build();
        sleepMoodRepository.save(entry);
    }

    private UserProfile getProfileEntity(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return userProfileRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    private WorkoutDTO mapToWorkoutDTO(Workout workout) {
        WorkoutDTO dto = new WorkoutDTO();
        dto.setId(workout.getId());
        dto.setWorkoutName(workout.getWorkoutName());
        dto.setTargetReps(workout.getTargetReps());
        dto.setTargetTime(workout.getTargetTime());
        dto.setActualReps(workout.getActualReps());
        dto.setCompleted(workout.getCompleted());
        dto.setDate(workout.getDate());
        return dto;
    }

    private MealDTO mapToMealDTO(Meal meal) {
        MealDTO dto = new MealDTO();
        dto.setId(meal.getId());
        dto.setProtein(meal.getProtein());
        dto.setCarbs(meal.getCarbs());
        dto.setFats(meal.getFats());
        dto.setCalories(meal.getCalories());
        dto.setWaterIntake(meal.getWaterIntake());
        dto.setDate(meal.getDate());
        return dto;
    }

    private SleepMoodDTO mapToSleepMoodDTO(SleepMood entry) {
        SleepMoodDTO dto = new SleepMoodDTO();
        dto.setId(entry.getId());
        dto.setSleepHours(entry.getSleepHours());
        dto.setMood(entry.getMood());
        dto.setStressLevel(entry.getStressLevel());
        dto.setDate(entry.getDate());
        return dto;
    }

    public TrainerProfileDTO getAssignedTrainer(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        List<Assignment> assignments = assignmentRepository.findByUser(user);
        if (assignments.isEmpty())
            return null;

        User trainer = assignments.get(0).getTrainer();
        TrainerProfileDTO dto = trainerService.getTrainerProfile(trainer.getUsername());
        dto.setUsername(trainer.getUsername()); // Add username for display
        return dto;
    }
}
