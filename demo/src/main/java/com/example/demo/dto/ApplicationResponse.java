package com.example.demo.dto;

import com.example.demo.entity.Application;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class ApplicationResponse {

    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("link")
    private String link;
    
    @JsonProperty("status")
    private String status;
    
    @JsonProperty("company")
    private String company;
    
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;



    // ── Static factory from Entity ──

    public static ApplicationResponse from(Application app) {
        ApplicationResponse res = new ApplicationResponse();
        res.id = app.getId();
        res.link = app.getLink();
        res.status = app.getStatus();
        res.company = app.getCompany();
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

    public String getCompany() {
        return company;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }


}
