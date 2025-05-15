package com.sms.smsbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document("sms_logs")
public class SmsLog {

    @Id
    private String id;

    private String userEmail;
    private String to;
    private String message;

    @Field("isAi") // ✅ This is the fix!
    private boolean isAi;
    private String category;
    private LocalDateTime dateSent;

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isAi() { return isAi; }
    public void setAi(boolean isAi) { this.isAi = isAi; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDateTime getDateSent() { return dateSent; }
    public void setDateSent(LocalDateTime dateSent) { this.dateSent = dateSent; }
}
