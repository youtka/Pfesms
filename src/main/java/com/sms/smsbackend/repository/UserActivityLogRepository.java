package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.UserActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserActivityLogRepository extends MongoRepository<UserActivityLog, String> {
}
