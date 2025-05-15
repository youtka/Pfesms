package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.Category;
import com.sms.smsbackend.service.CategoryService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;


import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createCategory(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String name = body.get("name");
        return ResponseEntity.ok(categoryService.createCategory(name, request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Category>> getMyCategories(HttpServletRequest request) {
        return ResponseEntity.ok(categoryService.getMyCategories(request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable String id, HttpServletRequest request) {
        return ResponseEntity.ok(categoryService.deleteCategory(id, request));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> renameCategory(@PathVariable String id, @RequestBody Map<String, String> body, HttpServletRequest request) {
        String name = body.get("name");
        return ResponseEntity.ok(categoryService.renameCategory(id, name, request));
    }

}
