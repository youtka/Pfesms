package com.sms.smsbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sms.smsbackend.model.SmsLog;
import com.sms.smsbackend.model.SmsRequest;
import com.sms.smsbackend.model.TwilioConfig;
import com.sms.smsbackend.repository.SmsLogRepository;
import com.sms.smsbackend.repository.TwilioConfigRepository;
import com.sms.smsbackend.security.JwtUtil;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SmsService {

    private final TwilioConfigRepository configRepo;
    private final JwtUtil jwtUtil;
    private final SmsLogRepository smsLogRepository;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final UserActivityLogService userActivityLogService;

    private final String OPENROUTER_API_KEY = "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";

    public SmsService(
            TwilioConfigRepository configRepo,
            JwtUtil jwtUtil,
            SmsLogRepository smsLogRepository,
            UserActivityLogService userActivityLogService
    ) {
        this.configRepo = configRepo;
        this.jwtUtil = jwtUtil;
        this.smsLogRepository = smsLogRepository;
        this.userActivityLogService = userActivityLogService;
        this.objectMapper = new ObjectMapper();
        this.webClient = WebClient.builder()
                .baseUrl("https://openrouter.ai/api/v1")
                .defaultHeader("Authorization", "Bearer " + OPENROUTER_API_KEY)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String sendSms(HttpServletRequest request, SmsRequest smsRequest) {
        String email = jwtUtil.extractUsername(jwtUtil.extractTokenFromRequest(request));
        Optional<TwilioConfig> configOpt = configRepo.findByUserEmail(email);

        if (configOpt.isEmpty()) {
            return "❌ No Twilio config found for this user.";
        }

        List<String> recipients = smsRequest.getPhoneNumbers();
        if (recipients == null || recipients.isEmpty()) {
            return "❌ No phone numbers to send to.";
        }

        System.out.println("🔁 isAi value: " + smsRequest.isAi());
        System.out.println("🧪 prompt value: " + smsRequest.getPrompt());

        TwilioConfig config = configOpt.get();
        Twilio.init(config.getSid(), config.getAuthToken());

        String finalMessage = smsRequest.isAi()
                ? generateMessageFromPrompt(smsRequest.getPrompt())
                : smsRequest.getMessage();

        if (finalMessage == null || finalMessage.trim().isEmpty()) {
            return "❌ Message content is empty.";
        }

        StringBuilder results = new StringBuilder();
        for (String to : recipients) {
            Message message = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(config.getFromNumber()),
                    finalMessage
            ).create();

            results.append("✅ Sent to ").append(to)
                    .append(" | SID: ").append(message.getSid())
                    .append("\n");

            SmsLog log = new SmsLog();
            log.setTo(to);
            log.setMessage(finalMessage);
            log.setUserEmail(email);
            log.setAi(smsRequest.isAi());
            log.setDateSent(LocalDateTime.now());
            log.setCategory(smsRequest.getCategory());
            smsLogRepository.save(log);

            // ✅ تسجيل النشاط
            userActivityLogService.log(
                    email,
                    "Send SMS",
                    "Sent " + (smsRequest.isAi() ? "AI-generated" : "manual") + " SMS to: " + to
            );
        }

        return results.toString();
    }

    private String generateMessageFromPrompt(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return "📨 AI Generated message (default)";
        }

        try {
            String requestBody = """
                {
                  "model": "openai/gpt-3.5-turbo",
                  "messages": [
                    {"role": "user", "content": "%s"}
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
