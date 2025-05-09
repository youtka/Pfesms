package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.SmsRequest;
import com.sms.smsbackend.service.SmsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sms")
public class SmsController {

    private final SmsService smsService;

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public String sendSms(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        System.out.println("📦 Raw request body: " + body);

        SmsRequest smsRequest = new SmsRequest();
        smsRequest.setPhoneNumbers((List<String>) body.get("phoneNumbers"));
        smsRequest.setPrompt((String) body.get("prompt"));
        smsRequest.setMessage((String) body.get("message"));
        smsRequest.setCategory((String) body.get("category"));

        // Safe parse isAi (whether string or boolean)
        Object isAiValue = body.get("isAi");
        boolean isAi = false;
        if (isAiValue instanceof Boolean) {
            isAi = (Boolean) isAiValue;
        } else if (isAiValue instanceof String) {
            isAi = Boolean.parseBoolean((String) isAiValue);
        }
        smsRequest.setAi(isAi);

        return smsService.sendSms(request, smsRequest);
    }
}
