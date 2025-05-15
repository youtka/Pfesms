package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.UserActivityLog;
import com.sms.smsbackend.repository.UserActivityLogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/logs")
public class AdminLogController {

    private final UserActivityLogRepository logRepository;

    public AdminLogController(UserActivityLogRepository logRepository) {
        this.logRepository = logRepository;
    }

    @GetMapping
    public List<UserActivityLog> getAllLogs() {
        return logRepository.findAll();
    }
}
