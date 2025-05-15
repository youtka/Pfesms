package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.SupportMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface SupportMessageRepository extends MongoRepository<SupportMessage, String> {

    // ✅ Fetch conversation between 2 users
    @Query("{$or: [ { $and: [ { 'senderEmail': ?0 }, { 'receiverEmail': ?1 } ] }, { $and: [ { 'senderEmail': ?1 }, { 'receiverEmail': ?0 } ] } ]}")
    List<SupportMessage> findConversation(String user1, String user2);

    // ✅ Check if user has unread messages
    boolean existsByReceiverEmailAndIsReadFalse(String receiverEmail);
}
