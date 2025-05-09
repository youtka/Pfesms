package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByEmail(String email);
    Optional<Category> findByEmailAndName(String email, String name);
    long countByEmail(String email); //

}
