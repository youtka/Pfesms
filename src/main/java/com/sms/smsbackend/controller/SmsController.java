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

        // ✅ Fix: use "numbers" not "phoneNumbers"
        Object phoneNumbersObj = body.get("numbers");
        if (phoneNumbersObj instanceof List<?> list) {
            smsRequest.setPhoneNumbers((List<String>) (List<?>) list);
        }

        smsRequest.setPrompt((String) body.get("prompt"));
        smsRequest.setMessage((String) body.get("message"));

        // ✅ Fix: use "categoryId" instead of "category"
        smsRequest.setCategory((String) body.get("categoryId"));

        // ✅ Safe parse isAi
        Object isAiValue = body.get("isAi");
        boolean isAi = false;
        if (isAiValue instanceof Boolean) {
            isAi = (Boolean) isAiValue;
        } else if (isAiValue instanceof String) {
            isAi = Boolean.parseBoolean((String) isAiValue);
        }
        smsRequest.setAi(isAi);

        // 🔍 Log everything for debug
        System.out.println("➡️ Parsed SMSRequest:");
        System.out.println("- PhoneNumbers: " + smsRequest.getPhoneNumbers());
        System.out.println("- Category: " + smsRequest.getCategory());
        System.out.println("- Message: " + smsRequest.getMessage());
        System.out.println("- isAi: " + smsRequest.isAi());
        System.out.println("- Prompt: " + smsRequest.getPrompt());

        return smsService.sendSms(request, smsRequest);
    }
}
