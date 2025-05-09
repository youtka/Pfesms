package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.TwilioConfig;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TwilioConfigRepository extends MongoRepository<TwilioConfig, String> {
    Optional<TwilioConfig> findByUserEmail(String userEmail);
}
