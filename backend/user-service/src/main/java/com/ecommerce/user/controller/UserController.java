package com.ecommerce.user.controller;

import com.ecommerce.user.dto.UserResponse;
import com.ecommerce.user.exception.NotFoundException;
import com.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /** Returns the currently authenticated user, resolved from the JWT subject (email). */
    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        var user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));
        return toResponse(user);
    }

    /** Used internally by order-service to attach user details to an order. */
    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id " + id));
        return toResponse(user);
    }

    private UserResponse toResponse(com.ecommerce.user.model.User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
