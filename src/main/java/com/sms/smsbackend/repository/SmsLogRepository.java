package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.SmsLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SmsLogRepository extends MongoRepository<SmsLog, String> {
    List<SmsLog> findByUserEmail(String userEmail);
    long countByUserEmail(String userEmail);
    long countByUserEmailAndAi(String userEmail, boolean isAi);
}
