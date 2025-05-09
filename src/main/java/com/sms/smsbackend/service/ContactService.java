package com.sms.smsbackend.service;

import com.sms.smsbackend.model.Contact;
import com.sms.smsbackend.repository.ContactRepository;
import com.sms.smsbackend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final JwtUtil jwtUtil;

    public ContactService(ContactRepository contactRepository, JwtUtil jwtUtil) {
        this.contactRepository = contactRepository;
        this.jwtUtil = jwtUtil;
    }

    public String saveContact(Contact contact, HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        String email = jwtUtil.extractUsername(token);
        contact.setEmail(email);
        contactRepository.save(contact);
        return "✅ Contact saved";
    }

    public List<Contact> getContacts(HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        String email = jwtUtil.extractUsername(token);
        return contactRepository.findByEmail(email);
    }
}
