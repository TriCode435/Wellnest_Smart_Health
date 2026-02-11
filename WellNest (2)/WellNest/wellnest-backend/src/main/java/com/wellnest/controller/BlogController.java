package com.wellnest.controller;

import com.wellnest.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok(blogService.getAllPosts());
    }

    @PostMapping
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<?> createPost(@RequestBody Map<String, String> body,
            Authentication authentication) {
        String title = body.get("title");
        String content = body.get("content");
        return ResponseEntity.ok(blogService.createPost(authentication.getName(), title, content));
    }
}
