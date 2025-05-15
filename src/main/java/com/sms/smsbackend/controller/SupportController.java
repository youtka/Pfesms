package com.sms.smsbackend.controller;

import com.sms.smsbackend.model.SupportMessage;
import com.sms.smsbackend.repository.SupportMessageRepository;
import com.sms.smsbackend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    private final SupportMessageRepository messageRepository;
    private final JwtUtil jwtUtil;

    public SupportController(SupportMessageRepository messageRepository, JwtUtil jwtUtil) {
        this.messageRepository = messageRepository;
        this.jwtUtil = jwtUtil;
    }

    // ✅ Get conversation & mark received messages as read
    @GetMapping("/{otherEmail}")
    public List<SupportMessage> getMessages(@PathVariable String otherEmail, HttpServletRequest request) {
        String currentEmail = jwtUtil.extractUsername(jwtUtil.extractTokenFromRequest(request));
        List<SupportMessage> messages = messageRepository.findConversation(currentEmail, otherEmail);

        messages.stream()
                .filter(msg -> msg.getReceiverEmail().equals(currentEmail) && !msg.isRead())
                .forEach(msg -> {
                    msg.setRead(true);
                    messageRepository.save(msg);
                });

        return messages;
    }

    // ✅ Send new message
    @PostMapping
    public SupportMessage sendMessage(@RequestBody SupportMessage message, HttpServletRequest request) {
        String currentEmail = jwtUtil.extractUsername(jwtUtil.extractTokenFromRequest(request));
        message.setSenderEmail(currentEmail);
        message.setTimestamp(new Date());
        message.setRead(false); // default unread
        return messageRepository.save(message);
    }

    // ✅ Check if there is a new unread message for this user
    @GetMapping("/new")
    public Map<String, Boolean> hasNewMessages(HttpServletRequest request) {
        String currentEmail = jwtUtil.extractUsername(jwtUtil.extractTokenFromRequest(request));
        boolean hasNew = messageRepository.existsByReceiverEmailAndIsReadFalse(currentEmail);
        return Collections.singletonMap("hasNew", hasNew);
    }
}
