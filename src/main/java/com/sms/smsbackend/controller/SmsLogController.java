package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.SmsLog;
import com.sms.smsbackend.repository.SmsLogRepository;
import com.sms.smsbackend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class SmsLogController {

    private final SmsLogRepository smsLogRepository;
    private final JwtUtil jwtUtil;

    public SmsLogController(SmsLogRepository smsLogRepository, JwtUtil jwtUtil) {
        this.smsLogRepository = smsLogRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<SmsLog> getUserLogs(HttpServletRequest request) {
        String email = jwtUtil.extractUsername(jwtUtil.extractTokenFromRequest(request));
        return smsLogRepository.findByUserEmail(email);
    }
}
