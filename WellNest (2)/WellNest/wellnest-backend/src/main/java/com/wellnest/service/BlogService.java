package com.wellnest.service;

import com.wellnest.entity.BlogPost;
import com.wellnest.entity.User;
import com.wellnest.repository.BlogPostRepository;
import com.wellnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlogService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    public BlogPost createPost(String username, String title, String content) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BlogPost post = BlogPost.builder()
                .title(title)
                .content(content)
                .author(author)
                .createdAt(LocalDateTime.now())
                .build();

        BlogPost savedPost = blogPostRepository.save(post);
        if (savedPost == null)
            throw new RuntimeException("Failed to save post");
        return savedPost;
    }
}
