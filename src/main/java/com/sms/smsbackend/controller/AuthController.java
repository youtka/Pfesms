package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.User;
import com.sms.smsbackend.repository.UserRepository;
import com.sms.smsbackend.security.JwtUtil;
import com.sms.smsbackend.service.AuthService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    // ✅ Register user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        user.setActive(true);
        user.setAdmin(false);
        String result = authService.register(user);

        if (result.startsWith("❌")) {
            return ResponseEntity.badRequest().body(result);
        }

        return ResponseEntity.ok(result);
    }

    // ✅ Login user & generate token
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("❌ Invalid email or password");
        }

        User user = userOpt.get();

        if (!user.isActive()) {
            return ResponseEntity.status(403).body("🚫 Account is deactivated");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("❌ Invalid email or password");
        }

        // ✅ generate JWT with email + isAdmin
        String token = jwtUtil.generateToken(user.getEmail(), user.isAdmin());
        return ResponseEntity.ok(token);
    }

    // ✅ Return user info from JWT
    @GetMapping("/me")
    public ResponseEntity<?> getUserFromToken(HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        Claims claims = jwtUtil.extractClaims(token);
        String email = claims.getSubject();

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(404).body("❌ User not found");
        }
    }
}
