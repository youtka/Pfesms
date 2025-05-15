package com.sms.smsbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sms.smsbackend.model.PhoneNumber;
import com.sms.smsbackend.model.SmsLog;
import com.sms.smsbackend.model.SmsRequest;
import com.sms.smsbackend.model.TwilioConfig;
import com.sms.smsbackend.repository.PhoneNumberRepository;
import com.sms.smsbackend.repository.SmsLogRepository;
import com.sms.smsbackend.repository.TwilioConfigRepository;
import com.sms.smsbackend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SmsService {

    private final TwilioConfigRepository configRepo;
    private final JwtUtil jwtUtil;
    private final SmsLogRepository smsLogRepository;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final UserActivityLogService userActivityLogService;
    private final PhoneNumberRepository phoneNumberRepository;
    private final AiService aiService;
    private final SmsSender smsSender;

    private final String OPENROUTER_API_KEY = "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";

    public SmsService(
            TwilioConfigRepository configRepo,
            JwtUtil jwtUtil,
            SmsLogRepository smsLogRepository,
            UserActivityLogService userActivityLogService,
            PhoneNumberRepository phoneNumberRepository,
            AiService aiService,
            SmsSender smsSender
    ) {
        this.configRepo = configRepo;
        this.jwtUtil = jwtUtil;
        this.smsLogRepository = smsLogRepository;
        this.userActivityLogService = userActivityLogService;
        this.phoneNumberRepository = phoneNumberRepository;
        this.aiService = aiService;
        this.smsSender = smsSender;
        this.objectMapper = new ObjectMapper();
        this.webClient = WebClient.builder()
                .baseUrl("https://openrouter.ai/api/v1")
                .defaultHeader("Authorization", "Bearer " + OPENROUTER_API_KEY)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String sendSms(HttpServletRequest request, SmsRequest smsRequest) {
        String email = jwtUtil.extractUsername(jwtUtil.extractTokenFromRequest(request));

        System.out.println("➡️ Parsed SMSRequest:");
        System.out.println("- PhoneNumbers: " + smsRequest.getPhoneNumbers());
        System.out.println("- CategoryId: " + smsRequest.getCategoryId());
        System.out.println("- useCategory: " + smsRequest.isUseCategory());
        System.out.println("- Message: " + smsRequest.getMessage());
        System.out.println("- isAi: " + smsRequest.isAi());
        System.out.println("- Prompt: " + smsRequest.getPrompt());

        List<String> recipients = smsRequest.getPhoneNumbers();

        // 🧠 AI message generation
        if (smsRequest.isAi() && (smsRequest.getMessage() == null || smsRequest.getMessage().trim().isEmpty())) {
            String prompt = smsRequest.getPrompt() != null ? smsRequest.getPrompt() : "Generate a short SMS message.";

            List<Map<String, String>> messages = List.of(
                    Map.of("role", "user", "content", prompt)
            );

            String aiMsg = aiService.generateMessage(messages);
            smsRequest.setMessage(aiMsg);
        }

        // ✅ Fetch by category if needed
        if (smsRequest.isUseCategory() && (recipients == null || recipients.isEmpty()) && smsRequest.getCategoryId() != null) {
            List<PhoneNumber> numbersInCategory = phoneNumberRepository.findByCategoryId(smsRequest.getCategoryId());
            recipients = numbersInCategory.stream()
                    .map(PhoneNumber::getPhoneNumber)
                    .collect(Collectors.toList());
            System.out.println("📥 Fetched " + recipients.size() + " numbers from category.");
        }

        if (recipients == null || recipients.isEmpty()) {
            return "❌ No recipients found";
        }

        for (String to : recipients) {
            try {
                smsSender.sendSms(email, to, smsRequest.getMessage(), smsRequest.isAi());
            } catch (Exception e) {
                System.err.println("❌ Failed to send to " + to + ": " + e.getMessage());
            }
        }

        return "✅ SMS Sent to " + recipients.size() + " recipient(s)";
    }

    private String generateMessageFromPrompt(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return "📨 AI Generated message (default)";
        }

        try {
            String requestBody = """
                {
                  \"model\": \"openai/gpt-3.5-turbo\",
                  \"messages\": [
                    {\"role\": \"user\", \"content\": \"%s\"}
                  ]
                }
            """.formatted(prompt);

            String response = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("🟡 RAW RESPONSE:\n" + response);

            JsonNode root = objectMapper.readTree(response);
            JsonNode contentNode = root.path("choices").get(0).path("message").path("content");

            if (contentNode != null && !contentNode.asText().isBlank()) {
                return contentNode.asText().trim().replaceAll("^\"|\"$", "");
            }

            return "📨 AI responded but no valid content.";
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ AI error: " + e.getMessage();
        }
    }
}