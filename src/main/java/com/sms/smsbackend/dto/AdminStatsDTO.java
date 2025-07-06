package com.sms.smsbackend.dto;

import java.util.List;

public class AdminStatsDTO {
    private long totalUsers;
    private long activeUsers;
    private long allSmsCount;
    private List<TopUserDto> topUsers;

    public AdminStatsDTO(long totalUsers, long activeUsers, long allSmsCount, List<TopUserDto> topUsers) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.allSmsCount = allSmsCount;
        this.topUsers = topUsers;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public long getAllSmsCount() {
        return allSmsCount;
    }

    public List<TopUserDto> getTopUsers() {
        return topUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public void setAllSmsCount(long allSmsCount) {
        this.allSmsCount = allSmsCount;
    }

    public void setTopUsers(List<TopUserDto> topUsers) {
        this.topUsers = topUsers;
    }
}