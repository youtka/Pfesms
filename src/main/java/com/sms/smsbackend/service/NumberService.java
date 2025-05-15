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
public class NumberService {

    private final PhoneNumberRepository numberRepository;
    private final CategoryRepository categoryRepository; // ✅ Added
    private final JwtUtil jwtUtil;

    public NumberService(PhoneNumberRepository numberRepository,
                         CategoryRepository categoryRepository,
                         JwtUtil jwtUtil) {
        this.numberRepository = numberRepository;
        this.categoryRepository = categoryRepository;
        this.jwtUtil = jwtUtil;
    }

    public String saveNumber(PhoneNumber number, HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        String email = jwtUtil.extractUsername(token);
        number.setEmail(email);

        if (number.getCategoryId() == null || number.getCategoryId().isEmpty()) {
            // 🔁 Auto-assign "Uncategorized"
            Category uncategorized = categoryRepository.findByEmailAndName(email, "Uncategorized")
                    .orElseGet(() -> categoryRepository.save(new Category(email, "Uncategorized")));

            number.setCategoryId(uncategorized.getId());
        }

        numberRepository.save(number);
        return "✅ Number saved successfully";
    }

    public List<PhoneNumber> getMyNumbers(HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        String email = jwtUtil.extractUsername(token);
        return numberRepository.findByEmail(email);
    }

    public List<PhoneNumber> getByCategoryId(String categoryId) {
        return numberRepository.findByCategoryId(categoryId);
    }

    public String deleteNumber(String id, HttpServletRequest request) {
        Optional<PhoneNumber> number = numberRepository.findById(id);
        if (number.isPresent()) {
            numberRepository.deleteById(id);
            return "🗑️ Number deleted";
        }
        return "❌ Number not found";
    }

    public String updateNumber(String id, PhoneNumber updatedNumber, HttpServletRequest request) {
        Optional<PhoneNumber> optionalNumber = numberRepository.findById(id);
        if (optionalNumber.isPresent()) {
            PhoneNumber dbNumber = optionalNumber.get();

            if (updatedNumber.getPhoneNumber() != null)
                dbNumber.setPhoneNumber(updatedNumber.getPhoneNumber());

            if (updatedNumber.getFullName() != null)
                dbNumber.setFullName(updatedNumber.getFullName());

            if (updatedNumber.getCategoryId() != null)
                dbNumber.setCategoryId(updatedNumber.getCategoryId());

            numberRepository.save(dbNumber);
            return "✅ Number updated successfully";
        }
        return "❌ Number not found";
    }
}
