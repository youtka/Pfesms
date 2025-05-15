package com.sms.smsbackend.service;

import com.sms.smsbackend.model.PasswordResetToken;
import com.sms.smsbackend.model.User;
import com.sms.smsbackend.repository.PasswordResetTokenRepository;
import com.sms.smsbackend.repository.UserRepository;
import com.sms.smsbackend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PasswordResetTokenRepository tokenRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       PasswordResetTokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.tokenRepository = tokenRepository;
    }

    // 🔐 Login
    public String login(User user) {
        System.out.println("🔐 Login request for: " + user.getEmail());

        User dbUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("❌ User not found"));

        System.out.println("✅ Found in DB: " + dbUser.getEmail());

        if (!passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            System.out.println("❌ Wrong password");
            return "Password incorrect!";
        }

        String token = jwtUtil.generateToken(dbUser.getEmail(), dbUser.isAdmin());

        System.out.println("🎟 Generated token: " + token);
        return token;
    }

    // 📝 Register
    public String register(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "❌ Email already exists!";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "✅ User registered successfully!";
    }

    // 🛠 Request password reset
    public String requestPasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "❌ No user found with this email.";
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(30);

        PasswordResetToken resetToken = new PasswordResetToken(email, token, expiry);
        tokenRepository.save(resetToken);

        return "✅ Password reset token: " + token;
    }

    // 🔁 Reset password using token
    public String resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return "❌ Invalid token.";
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return "❌ Token expired.";
        }

        Optional<User> userOpt = userRepository.findByEmail(resetToken.getEmail());
        if (userOpt.isEmpty()) {
            return "❌ No user found.";
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.deleteByToken(token);

        return "✅ Password updated successfully.";
    }
}
