package com.sms.smsbackend.dto;

public class TopUserDto {
    private String email;
    private long smsCount;

    public TopUserDto(String email, long smsCount) {
        this.email = email;
        this.smsCount = smsCount;
    }

    public String getEmail() {
        return email;
    }

    public long getSmsCount() {
        return smsCount;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSmsCount(long smsCount) {
        this.smsCount = smsCount;
    }
}
