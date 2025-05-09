package com.sms.smsbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "numbers")
public class PhoneNumber {
    @Id
    private String id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String category;
    private String categoryId; // ✅ ADD THIS

    // Getters & Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryId() {  // ✅ getter
        return categoryId;
    }

    public void setCategoryId(String categoryId) {  // ✅ setter
        this.categoryId = categoryId;
    }
}
