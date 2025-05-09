package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.Contact;
import com.sms.smsbackend.service.ContactService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody Contact contact, HttpServletRequest request) {
        String result = contactService.saveContact(contact, request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Contact>> getAll(HttpServletRequest request) {
        List<Contact> list = contactService.getContacts(request);
        return ResponseEntity.ok(list);
    }
}
