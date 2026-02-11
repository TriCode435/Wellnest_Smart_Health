package com.wellnest.repository;

import com.wellnest.entity.UserProfile;
import com.wellnest.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByProfile(UserProfile profile);

    List<Workout> findByProfileAndDate(UserProfile profile, LocalDate date);

    List<Workout> findByProfileAndDateBetween(UserProfile profile, LocalDate startDate, LocalDate endDate);
}
