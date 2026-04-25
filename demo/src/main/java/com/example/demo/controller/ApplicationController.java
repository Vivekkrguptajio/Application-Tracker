package com.example.demo.controller;

import com.example.demo.dto.ApplicationRequest;
import com.example.demo.dto.ApplicationResponse;
import com.example.demo.dto.StatusUpdateRequest;
import com.example.demo.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService service;

    public ApplicationController(ApplicationService service) {
        this.service = service;
    }

    /**
     * GET /api/applications — Fetch all applications
     */
    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(service.getAll());
    }

    /**
     * GET /api/applications/{id} — Fetch single application by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /**
     * POST /api/applications — Create a new application
     */
    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @Valid @RequestBody ApplicationRequest request) {
        ApplicationResponse created = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/applications/{id}/status — Update application status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(service.updateStatus(id, request));
    }

    /**
     * DELETE /api/applications/{id} — Delete an application
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteApplication(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(Map.of("message", "Application deleted successfully"));
    }
}