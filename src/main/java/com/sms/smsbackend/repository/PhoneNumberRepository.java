package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.PhoneNumber;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PhoneNumberRepository extends MongoRepository<PhoneNumber, String> {
    List<PhoneNumber> findByEmail(String email);
    List<PhoneNumber> findByCategoryId(String categoryId);
    long countByEmail(String email);// make sure it's returning PhoneNumber, not java.lang.Number
}