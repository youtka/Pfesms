package com.sms.smsbackend.model;

import java.util.List;

public class SmsRequest {
    private String categoryId;             // if useCategory = true
    private boolean useCategory;           // true: use category, false: use phoneNumbers
    private List<String> phoneNumbers;     // if useCategory = false

    private boolean isAi;                  // true: generate from AI
    private String prompt;                 // AI message prompt
    private String message;
    private String category;
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
// manual message

    // Getters & Setters
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public boolean isUseCategory() { return useCategory; }
    public void setUseCategory(boolean useCategory) { this.useCategory = useCategory; }

    public List<String> getPhoneNumbers() { return phoneNumbers; }
    public void setPhoneNumbers(List<String> phoneNumbers) { this.phoneNumbers = phoneNumbers; }

    public boolean isAi() { return isAi; }
    public void setAi(boolean ai) { isAi = ai; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
