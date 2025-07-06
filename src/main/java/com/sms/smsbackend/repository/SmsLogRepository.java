package com.sms.smsbackend.repository;

import com.sms.smsbackend.model.SmsLog;
import com.sms.smsbackend.dto.TopUserDto;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SmsLogRepository extends MongoRepository<SmsLog, String> {
    List<SmsLog> findByUserEmail(String userEmail);
    long countByUserEmail(String userEmail);
    long countByUserEmailAndAi(String userEmail, boolean isAi);

    @Aggregation(pipeline = {
            "{ $group: { _id: '$userEmail', smsCount: { $sum: 1 } } }",
            "{ $sort: { smsCount: -1 } }",
            "{ $limit: 5 }",
            "{ $project: { email: '$_id', smsCount: 1, _id: 0 } }"
    })
    List<TopUserDto> getTopUsersBySmsCount();
}
