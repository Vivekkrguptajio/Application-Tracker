package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ApplicationRequest {

    @NotBlank(message = "Application link is required")
    @Size(max = 2048, message = "Link must not exceed 2048 characters")
    private String link;

    private String company;

    // ── Getters & Setters ──

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }
}
