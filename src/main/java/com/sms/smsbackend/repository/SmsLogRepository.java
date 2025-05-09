package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.SmsLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SmsLogRepository extends MongoRepository<SmsLog, String> {
    List<SmsLog> findByUserEmail(String userEmail); // 🟢 Needed for statistics
}
