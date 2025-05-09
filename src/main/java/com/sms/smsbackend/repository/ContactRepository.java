package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ContactRepository extends MongoRepository<Contact, String> {
    List<Contact> findByEmail(String email); // All contacts by user
}
