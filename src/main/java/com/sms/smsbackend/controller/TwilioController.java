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
    public Optional<TwilioConfig> getConfig(@RequestParam String email) {
        return service.getUserConfig(email);
    }
}
