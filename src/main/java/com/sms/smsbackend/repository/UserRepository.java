package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    long countByActive(boolean active);

}
