package com.example.demo.dto;

import com.example.demo.entity.Application;
import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long id;
    private String link;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── Static factory from Entity ──

    public static ApplicationResponse from(Application app) {
        ApplicationResponse res = new ApplicationResponse();
        res.id = app.getId();
        res.link = app.getLink();
        res.status = app.getStatus();
        res.createdAt = app.getCreatedAt();
        res.updatedAt = app.getUpdatedAt();
        return res;
    }

    // ── Getters ──

    public Long getId() {
        return id;
    }

    public String getLink() {
        return link;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
