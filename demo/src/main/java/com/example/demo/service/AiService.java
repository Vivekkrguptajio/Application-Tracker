package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class AiService {

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();

    public String detectCompanyFromUrl(String url) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            // Constructing the prompt for Groq
            String prompt = "Extract only the company name from this job application URL: " + url + 
                           ". Return only the company name, nothing else. If you can't find it, return 'Unknown'.";

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.1-8b-instant");
            
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            body.put("messages", messages);
            body.put("temperature", 0.1); // Low temperature for factual extraction

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    String content = ((String) message.get("content")).trim();
                    // Remove any potential quotes Groq might add
                    content = content.replace("\"", "").replace("'", "");
                    System.out.println("AI Detected Company: " + content);
                    return content;
                }
            } else {
                System.err.println("Groq API returned error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error calling Groq API: " + e.getMessage());
            e.printStackTrace();
        }
        return "Unknown";
    }
}
