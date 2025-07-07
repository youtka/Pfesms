package com.sms.smsbackend.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    // ✅ استعمل الرابط والنموذج الجديد
    private final String API_URL = "https://openrouter.ai/api/v1/chat/completions";
    private final String API_KEY = "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";
    private final String MODEL = "openrouter/cypher-alpha:free";

    // ✅ One-shot string prompt (old style)
    public String generateSingleMessage(String prompt) {
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        return generateMessage(List.of(message));
    }

    // ✅ Full chat (used in /analyze)
    public String generateMessage(List<Map<String, String>> messages) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("HTTP-Referer", "https://yourapp.com");
        headers.set("X-Title", "SMS AI Advisor");

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", MODEL);
        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(API_URL, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            Map choice = (Map) ((List<?>) response.getBody().get("choices")).get(0);
            Map message = (Map) choice.get("message");
            return (String) message.get("content");
        } else {
            return "❌ Failed to generate message";
        }
    }
}
