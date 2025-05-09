package com.sms.smsbackend.service;

import com.sms.smsbackend.model.Category;
import com.sms.smsbackend.model.PhoneNumber;
import com.sms.smsbackend.repository.CategoryRepository;
import com.sms.smsbackend.repository.PhoneNumberRepository;
import com.sms.smsbackend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final PhoneNumberRepository phoneNumberRepository;
    private final JwtUtil jwtUtil;

    public CategoryService(CategoryRepository categoryRepository, PhoneNumberRepository phoneNumberRepository, JwtUtil jwtUtil) {
        this.categoryRepository = categoryRepository;
        this.phoneNumberRepository = phoneNumberRepository;
        this.jwtUtil = jwtUtil;
    }

    public String createCategory(String name, HttpServletRequest request) {
        String email = jwtUtil.extractUsername(jwtUtil.extractTokenFromRequest(request));

        Optional<Category> existing = categoryRepository.findByEmailAndName(email, name);
        if (existing.isPresent()) return "❌ Category already exists";

        Category category = new Category(email, name);
        categoryRepository.save(category);
        return "✅ Category created";
    }

    public List<Category> getMyCategories(HttpServletRequest request) {
        String email = jwtUtil.extractUsername(jwtUtil.extractTokenFromRequest(request));
        return categoryRepository.findByEmail(email);
    }

    public String deleteCategory(String id, HttpServletRequest request) {
        String email = jwtUtil.extractUsername(jwtUtil.extractTokenFromRequest(request));
        Category toDelete = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!toDelete.getEmail().equals(email)) {
            return "❌ Unauthorized";
        }

        if (toDelete.getName().equalsIgnoreCase("Uncategorized")) {
            return "❌ Cannot delete default category";
        }

        Category uncategorized = categoryRepository.findByEmailAndName(email, "Uncategorized")
                .orElseGet(() -> categoryRepository.save(new Category(email, "Uncategorized")));

        List<PhoneNumber> numbers = phoneNumberRepository.findByCategoryId(id);
        for (PhoneNumber number : numbers) {
            number.setCategoryId(uncategorized.getId());
            phoneNumberRepository.save(number);
        }

        categoryRepository.deleteById(id);
        return "✅ Category deleted, numbers moved to Uncategorized";
    }
}
