package com.wellnest.repository;

import com.wellnest.entity.User;
import com.wellnest.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndRole(String username, Role role);
}
