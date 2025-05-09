package com.sms.smsbackend.service;

import com.sms.smsbackend.repository.SmsLogRepository;
import com.sms.smsbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final SmsLogRepository smsLogRepository;

    public AdminService(UserRepository userRepository, SmsLogRepository smsLogRepository) {
        this.userRepository = userRepository;
        this.smsLogRepository = smsLogRepository;
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActive(true);
        long inactiveUsers = totalUsers - activeUsers;
        long totalSms = smsLogRepository.count();

        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("deactivatedUsers", inactiveUsers);
        stats.put("totalSmsSent", totalSms);

        return stats;
    }
}
