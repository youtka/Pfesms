package com.sms.smsbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public class User {
    @Id
    private String id;

    private String email;
    private String password;
    private String role = "USER";  // can be "USER" or "ADMIN"
    private String fullName;
    private boolean active = true; // for soft deletion

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
//    @JsonIgnore
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    // Check if user is admin


    // Set role to admin or user
    public void setAdmin(boolean isAdmin) {
        this.role = isAdmin ? "ADMIN" : "USER";
    }

    // Helper
    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(this.role);
    }
}
