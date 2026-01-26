package com.wellnest.repository;

import com.wellnest.entity.TrainerUserMapping;
import com.wellnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrainerUserMappingRepository extends JpaRepository<TrainerUserMapping, Long> {
    List<TrainerUserMapping> findByTrainer(User trainer);

    List<TrainerUserMapping> findByUser(User user);
}
