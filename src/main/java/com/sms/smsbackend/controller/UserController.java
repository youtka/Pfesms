package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.User;
import com.sms.smsbackend.service.UserActivityLogService;
import com.sms.smsbackend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final UserActivityLogService userActivityLogService;

    public UserController(UserService userService, UserActivityLogService userActivityLogService) {
        this.userService = userService;
        this.userActivityLogService = userActivityLogService;
    }

    // 👤 Get Current Profile
    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        return ResponseEntity.ok(user);
    }

    // 🔁 Update Profile + Logging
    @PutMapping("/update")
    public ResponseEntity<String> updateMyProfile(@RequestBody User updatedUser, HttpServletRequest request) {
        String result = userService.updateCurrentUser(updatedUser, request);

        String email = userService.getCurrentUser(request).getEmail();
        userActivityLogService.log(email, "Update Profile", "User updated their profile");

        return ResponseEntity.ok(result);
    }

    // ❌ Delete Account + Logging
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMyAccount(HttpServletRequest request) {
        String email = userService.getCurrentUser(request).getEmail();

        String result = userService.deleteCurrentUser(request);

        userActivityLogService.log(email, "Delete Account", "User deleted their account");

        return ResponseEntity.ok(result);
    }
}
