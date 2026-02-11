package com.wellnest.dto;

import com.wellnest.entity.Role;
import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
    private Role role;
}
