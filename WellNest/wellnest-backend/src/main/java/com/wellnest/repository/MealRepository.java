package com.wellnest.repository;

import com.wellnest.entity.Meal;
import com.wellnest.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByProfile(UserProfile profile);

    List<Meal> findByProfileAndDate(UserProfile profile, LocalDate date);

    List<Meal> findByProfileAndDateBetween(UserProfile profile, LocalDate startDate, LocalDate endDate);
}
