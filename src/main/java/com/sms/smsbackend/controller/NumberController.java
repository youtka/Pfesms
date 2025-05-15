package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.PhoneNumber;
import com.sms.smsbackend.model.User;
import com.sms.smsbackend.service.NumberService;
import com.sms.smsbackend.service.UserActivityLogService;
import com.sms.smsbackend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/number")
public class NumberController {

    private final NumberService numberService;
    private final UserActivityLogService userActivityLogService;
    private final UserService userService;

    public NumberController(NumberService numberService,
                            UserActivityLogService userActivityLogService,
                            UserService userService) {
        this.numberService = numberService;
        this.userActivityLogService = userActivityLogService;
        this.userService = userService;
    }

    // ✅ Add Number
    @PostMapping("/add")
    public ResponseEntity<String> addNumber(@RequestBody PhoneNumber number, HttpServletRequest request) {
        String result = numberService.saveNumber(number, request);

        User currentUser = userService.getCurrentUser(request);
        userActivityLogService.log(
                currentUser.getEmail(),
                "Add Number",
                "User added number: " + number.getPhoneNumber()
        );

        return ResponseEntity.ok(result);
    }

    // ✅ Get All Numbers
    @GetMapping("/all")
    public ResponseEntity<List<PhoneNumber>> getMyNumbers(HttpServletRequest request) {
        return ResponseEntity.ok(numberService.getMyNumbers(request));
    }

    // ✅ Get Numbers by Category
    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<PhoneNumber>> getNumbersByCategory(@PathVariable String categoryId) {
        List<PhoneNumber> numbers = numberService.getByCategoryId(categoryId);
        return ResponseEntity.ok(numbers);
    }

    // ✅ Delete Number
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteNumber(@PathVariable String id, HttpServletRequest request) {
        User currentUser = userService.getCurrentUser(request);

        String result = numberService.deleteNumber(id, request);

        userActivityLogService.log(
                currentUser.getEmail(),
                "Delete Number",
                "User deleted number with ID: " + id
        );

        return ResponseEntity.ok(result);
    }

    // ✅ Update Number
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateNumber(@PathVariable String id, @RequestBody PhoneNumber number, HttpServletRequest request) {
        User currentUser = userService.getCurrentUser(request);

        String result = numberService.updateNumber(id, number, request);

        userActivityLogService.log(
                currentUser.getEmail(),
                "Update Number",
                "User updated number with ID: " + id + " to: " + number.getPhoneNumber()
        );

        return ResponseEntity.ok(result);
    }
}
