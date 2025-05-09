package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.TestItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestItemRepository extends MongoRepository<TestItem, String> {
}
