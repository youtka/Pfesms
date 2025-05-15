package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.User;
import com.sms.smsbackend.repository.UserRepository;
import com.sms.smsbackend.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final AdminService adminService;

    public AdminController(UserRepository userRepository, AdminService adminService) {
        this.userRepository = userRepository;
        this.adminService = adminService;
    }

    // 👥 Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🗑️ Delete user by ID
    @DeleteMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return "✅ User deleted.";
    }

    // 🚫 Toggle active status
    @PostMapping("/users/{id}/toggle-active")
    public String toggleUser(@PathVariable String id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return "❌ User not found.";

        user.setActive(!user.isActive());
        userRepository.save(user);

        return user.isActive() ? "✅ User reactivated." : "🚫 User deactivated.";
    }

    // 🛡️ Toggle admin/user role
    @PostMapping("/users/{id}/toggle-role")
    public String toggleUserRole(@PathVariable String id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return "❌ User not found.";

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            user.setRole("USER");
        } else {
            user.setRole("ADMIN");
        }

        userRepository.save(user);
        return user.isAdmin() ? "✅ User is now ADMIN." : "👤 User is now regular USER.";
    }

    // ✏️ Update full name
    @PutMapping("/users/{id}/update")
    public String updateUserFullName(@PathVariable String id, @RequestBody Map<String, String> body) {
        String fullName = body.get("fullName");
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return "❌ User not found.";

        user.setFullName(fullName);
        userRepository.save(user);

        return "✅ User name updated.";
    }

    // 📊 Admin statistics
    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {
        return adminService.getStatistics();
    }
}
