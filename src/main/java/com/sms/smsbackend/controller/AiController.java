package com.sms.smsbackend.controller;

import com.sms.smsbackend.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    // 🟢 One-shot prompt
    @PostMapping("/generate")
    public ResponseEntity<String> generateMessage(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String aiText = aiService.generateSingleMessage(prompt);
        return ResponseEntity.ok(aiText);
    }

    // 🧠 Full chat prompt
    @PostMapping("/analyze")
    public ResponseEntity<String> analyze(@RequestBody List<Map<String, String>> messages) {
        String aiResponse = aiService.generateMessage(messages);
        return ResponseEntity.ok(aiResponse);
    }
}
