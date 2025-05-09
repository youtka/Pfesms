package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.User;
import com.sms.smsbackend.service.AuthService;
import com.sms.smsbackend.service.UserActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserActivityLogService userActivityLogService;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        String result = authService.register(user);

        // 📝 Log registration
        userActivityLogService.log(user.getEmail(), "Register", "User registered successfully");

        return ResponseEntity.ok(result);
    }

    // 🔐 Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            String token = authService.login(user);

            // ✅ Log the user activity
            userActivityLogService.log(user.getEmail(), "Login", "User logged in successfully");

            System.out.println("🧾 TOKEN FROM SERVICE: " + token);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String result = authService.requestPasswordReset(email);

        // 📩 Log forgot password request
        userActivityLogService.log(email, "Forgot Password", "User requested password reset");

        return ResponseEntity.ok(result);
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        String result = authService.resetPassword(token, newPassword);

        // 🔐 Log reset password
        userActivityLogService.log("Unknown", "Reset Password", "User reset password using token"); // can be improved if we fetch user by token

        return ResponseEntity.ok(result);
    }

}
