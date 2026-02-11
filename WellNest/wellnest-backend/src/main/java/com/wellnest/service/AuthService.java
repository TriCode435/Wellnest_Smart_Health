package com.wellnest.service;

import com.wellnest.config.JwtUtils;
import com.wellnest.dto.LoginRequest;
import com.wellnest.dto.LoginResponse;
import com.wellnest.dto.RegisterRequest;
import com.wellnest.entity.Role;
import com.wellnest.entity.User;
import com.wellnest.entity.UserProfile;
import com.wellnest.entity.TrainerProfile;
import com.wellnest.repository.UserRepository;
import com.wellnest.repository.UserProfileRepository;
import com.wellnest.repository.TrainerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private TrainerProfileRepository trainerProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public LoginResponse login(LoginRequest loginRequest) {
        // Find user by username and role
        User user = userRepository.findByUsernameAndRole(loginRequest.getUsername(), loginRequest.getRole())
                .orElseThrow(() -> new RuntimeException("Error: Invalid credentials or role"));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(user.getUsername(), user.getRole().name());

        return new LoginResponse(jwt, user.getId(), user.getUsername(), user.getRole());
    }

    public String register(RegisterRequest registerRequest) {
        if (userRepository.findByUsernameAndRole(registerRequest.getUsername(), registerRequest.getRole())
                .isPresent()) {
            throw new RuntimeException("Error: Username is already taken for this role!");
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .build();

        userRepository.save(user);

        // Initialize empty profile
        if (user.getRole() == Role.USER) {
            userProfileRepository.save(UserProfile.builder().user(user).build());
        } else if (user.getRole() == Role.TRAINER) {
            trainerProfileRepository.save(TrainerProfile.builder().user(user).build());
        }

        return "User registered successfully!";
    }
}
