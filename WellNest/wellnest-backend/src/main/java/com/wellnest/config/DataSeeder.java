package com.wellnest.config;

import com.wellnest.entity.Role;
import com.wellnest.entity.User;
import com.wellnest.entity.UserProfile;
import com.wellnest.entity.TrainerProfile;
import com.wellnest.repository.UserRepository;
import com.wellnest.repository.UserProfileRepository;
import com.wellnest.repository.TrainerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private TrainerProfileRepository trainerProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Admin
            userRepository.save(User.builder()
                    .username("admin")
                    .email("admin@wellnest.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build());

            // Seed Trainer
            User trainer = User.builder()
                    .username("trainer")
                    .email("trainer@wellnest.com")
                    .password(passwordEncoder.encode("trainer123"))
                    .role(Role.TRAINER)
                    .build();
            userRepository.save(trainer);
            trainerProfileRepository.save(TrainerProfile.builder().user(trainer).build());

            // Seed User
            User user = User.builder()
                    .username("user")
                    .email("user@wellnest.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .build();
            userRepository.save(user);
            userProfileRepository.save(UserProfile.builder().user(user).build());

            System.out.println("Sample data seeded successfully!");
        }
    }
}
