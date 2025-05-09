package com.sms.smsbackend.service;

import com.sms.smsbackend.model.UserActivityLog;
import com.sms.smsbackend.repository.UserActivityLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserActivityLogService {

    private final UserActivityLogRepository logRepository;

    public UserActivityLogService(UserActivityLogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public void log(String userEmail, String action, String description) {
        UserActivityLog log = new UserActivityLog();
        log.setUserEmail(userEmail);
        log.setAction(action);
        log.setDescription(description);
        log.setTimestamp(LocalDateTime.now());
        logRepository.save(log);
    }
}
