package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.TwilioConfig;
import com.sms.smsbackend.service.TwilioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/twilio")
public class TwilioController {

    @Autowired
    private TwilioService service;

    @PostMapping("/save")
    public String saveConfig(@RequestBody TwilioConfig config) {
        return service.saveConfig(config);
    }

    @GetMapping("/get")
    public TwilioConfig getConfig(@RequestParam String email) {
        Optional<TwilioConfig> configOpt = service.getUserConfig(email);

        // إذا ماكاينش config أصلا
        if (configOpt.isEmpty()) {
            return new TwilioConfig();
        }

        TwilioConfig config = configOpt.get();

        // إلا كانت وحدة من القيم فارغة، رجع config فارغ (باش frontend يقدر يبان alert)
        if (isNullOrEmpty(config.getSid()) ||
                isNullOrEmpty(config.getAuthToken()) ||
                isNullOrEmpty(config.getFromNumber())) {
            return new TwilioConfig();
        }

        return config;
    }

    private boolean isNullOrEmpty(String s) {
        return s == null || s.trim().isEmpty();
    }
}
