package com.sms.smsbackend.service;

import com.sms.smsbackend.model.TwilioConfig;
import com.sms.smsbackend.repository.TwilioConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TwilioService {

    @Autowired
    private TwilioConfigRepository repository;

    public String saveConfig(TwilioConfig config) {
        Optional<TwilioConfig> existing = repository.findByUserEmail(config.getUserEmail());
        if (existing.isPresent()) {
            TwilioConfig old = existing.get();
            old.setSid(config.getSid());
            old.setAuthToken(config.getAuthToken());
            old.setFromNumber(config.getFromNumber());
            repository.save(old);
            return "✅ Twilio config updated";
        } else {
            repository.save(config);
            return "✅ Twilio config saved";
        }
    }

    public Optional<TwilioConfig> getUserConfig(String userEmail) {
        return repository.findByUserEmail(userEmail);
    }
}
