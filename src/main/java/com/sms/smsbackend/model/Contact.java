package com.sms.smsbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "contacts")
public class Contact {
    @Id
    private String id;
    private String email;         // Who owns the contact
    private String fullName;
    private String phoneNumber;
    private String category;
}
