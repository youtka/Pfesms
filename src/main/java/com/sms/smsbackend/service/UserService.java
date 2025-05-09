package com.sms.smsbackend.service;

import com.sms.smsbackend.model.User;
import com.sms.smsbackend.repository.UserRepository;
import com.sms.smsbackend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ Get current user from JWT token
    public User getCurrentUser(HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        String email = jwtUtil.extractUsername(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("❌ User not found"));
    }

    // ✅ Update current user's profile
    public String updateCurrentUser(User updatedUser, HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        String email = jwtUtil.extractUsername(token);

        User dbUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("❌ User not found"));

        if (updatedUser.getFullName() != null) {
            dbUser.setFullName(updatedUser.getFullName());
        }

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            dbUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        userRepository.save(dbUser);
        return "✅ Profile updated successfully";
    }

    // ✅ Delete current user
    public String deleteCurrentUser(HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        String email = jwtUtil.extractUsername(token);

        User dbUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("❌ User not found"));

        userRepository.delete(dbUser);
        return "✅ User deleted successfully";
    }


}
