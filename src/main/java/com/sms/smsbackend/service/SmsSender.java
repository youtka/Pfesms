package com.sms.smsbackend.service;

import com.sms.smsbackend.model.SmsLog;
import com.sms.smsbackend.model.TwilioConfig;
import com.sms.smsbackend.repository.SmsLogRepository;
import com.sms.smsbackend.repository.TwilioConfigRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SmsSender {

    private final TwilioConfigRepository configRepo;
    private final SmsLogRepository smsLogRepository;

    public SmsSender(TwilioConfigRepository configRepo, SmsLogRepository smsLogRepository) {
        this.configRepo = configRepo;
        this.smsLogRepository = smsLogRepository;
    }

    public void sendSms(String userEmail, String to, String body, boolean isAi) {
        TwilioConfig config = configRepo.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("❌ Twilio config not found for user: " + userEmail));

        Twilio.init(config.getSid(), config.getAuthToken());

        Message message = Message.creator(
                new PhoneNumber(to),
                new PhoneNumber(config.getFromNumber()),
                body
        ).create();

        System.out.println("📤 Twilio SID: " + message.getSid());

        SmsLog log = new SmsLog();
        log.setUserEmail(userEmail);
        log.setTo(to);
        log.setMessage(body);
        log.setAi(isAi);
        log.setDateSent(LocalDateTime.now());  // ✅ FIXED LINE

        smsLogRepository.save(log);
    }
}
