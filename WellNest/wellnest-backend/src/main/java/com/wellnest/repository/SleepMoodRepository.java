package com.wellnest.repository;

import com.wellnest.entity.SleepMood;
import com.wellnest.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface SleepMoodRepository extends JpaRepository<SleepMood, Long> {
    List<SleepMood> findByProfile(UserProfile profile);

    List<SleepMood> findByProfileAndDate(UserProfile profile, LocalDate date);

    List<SleepMood> findByProfileAndDateBetween(UserProfile profile, LocalDate startDate, LocalDate endDate);
}
