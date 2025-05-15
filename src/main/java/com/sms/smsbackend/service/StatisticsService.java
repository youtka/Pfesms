package com.sms.smsbackend.service;

import com.sms.smsbackend.repository.CategoryRepository;
import com.sms.smsbackend.repository.PhoneNumberRepository;
import com.sms.smsbackend.repository.SmsLogRepository;
import com.sms.smsbackend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import com.sms.smsbackend.model.SmsLog;


import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class StatisticsService {

    private final JwtUtil jwtUtil;
    private final SmsLogRepository smsLogRepository;
    private final PhoneNumberRepository phoneNumberRepository;
    private final CategoryRepository categoryRepository;

    public StatisticsService(JwtUtil jwtUtil,
                             SmsLogRepository smsLogRepository,
                             PhoneNumberRepository phoneNumberRepository,
                             CategoryRepository categoryRepository) {
        this.jwtUtil = jwtUtil;
        this.smsLogRepository = smsLogRepository;
        this.phoneNumberRepository = phoneNumberRepository;
        this.categoryRepository = categoryRepository;
    }

    public Map<String, Object> getUserStatistics(HttpServletRequest request) {
        String email = jwtUtil.extractUsername(jwtUtil.extractTokenFromRequest(request));
        Map<String, Object> result = new HashMap<>();

        long totalCategories = categoryRepository.countByEmail(email);
        long totalNumbers = phoneNumberRepository.countByEmail(email);
        long totalSmsSent = smsLogRepository.findByUserEmail(email).size();
        long totalAiMessages = smsLogRepository.findByUserEmail(email).stream()
                .filter(SmsLog::isAi)
                .count();

        // Group by category
        Map<String, Long> messagesPerCategory = new HashMap<>();
        smsLogRepository.findByUserEmail(email).forEach(log -> {
            String cat = log.getCategory() != null ? log.getCategory() : "Uncategorized";
            messagesPerCategory.put(cat, messagesPerCategory.getOrDefault(cat, 0L) + 1);
        });

        // Group by day
        Map<String, Long> messagesPerDay = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        smsLogRepository.findByUserEmail(email).forEach(log -> {
            String date = log.getDateSent().toLocalDate().format(formatter);
            messagesPerDay.put(date, messagesPerDay.getOrDefault(date, 0L) + 1);
        });

        result.put("totalCategories", totalCategories);
        result.put("totalNumbers", totalNumbers);
        result.put("totalSmsSent", totalSmsSent);
        result.put("totalAiMessages", totalAiMessages);
        result.put("messagesPerCategory", messagesPerCategory);
        result.put("messagesPerDay", messagesPerDay);

        return result;
    }

}
