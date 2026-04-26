package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        // Load .env file manually if it exists
        try {
            java.nio.file.Path envPath = java.nio.file.Paths.get(".env");
            if (java.nio.file.Files.exists(envPath)) {
                System.out.println("Loading environment from .env file...");
                java.nio.file.Files.lines(envPath)
                    .filter(line -> line.contains("=") && !line.startsWith("#"))
                    .forEach(line -> {
                        String[] parts = line.split("=", 2);
                        String key = parts[0].trim();
                        String value = parts[1].trim();
                        System.setProperty(key, value);
                        System.out.println("Set property: " + key);
                    });
            } else {
                System.out.println(".env file not found at: " + envPath.toAbsolutePath());
            }
        } catch (Exception e) {
            System.err.println("Failed to load .env file: " + e.getMessage());
        }

        // Force IST TimeZone globally before start
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(DemoApplication.class, args);
    }
}
