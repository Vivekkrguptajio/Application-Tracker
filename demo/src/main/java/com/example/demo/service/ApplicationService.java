package com.example.demo.service;

import com.example.demo.dto.ApplicationRequest;
import com.example.demo.dto.ApplicationResponse;
import com.example.demo.dto.StatusUpdateRequest;
import com.example.demo.entity.Application;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository repository;
    private final AiService aiService;

    public ApplicationService(ApplicationRepository repository, 
                            AiService aiService) {
        this.repository = repository;
        this.aiService = aiService;
    }

    /**
     * Fix all applications with 'Unknown' or null company names using AI.
     */
    @Transactional
    public Map<String, Object> fixUnknownCompanies() {
        List<Application> unknowns = repository.findAll().stream()
                .filter(app -> app.getCompany() == null || "Unknown".equalsIgnoreCase(app.getCompany()))
                .toList();

        int fixedCount = 0;
        for (Application app : unknowns) {
            String detected = aiService.detectCompanyFromUrl(app.getLink());
            
            if (detected != null && !"Unknown".equalsIgnoreCase(detected)) {
                app.setCompany(detected);
                repository.save(app);
                fixedCount++;
            }
        }

        return Map.of(
            "totalUnknowns", unknowns.size(),
            "fixedCount", fixedCount,
            "message", "AI cleanup completed"
        );
    }

    /**
     * Get all applications, ordered by newest first.
     */
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Get a single application by ID.
     */
    @Transactional(readOnly = true)
    public ApplicationResponse getById(Long id) {
        Application app = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));
        return ApplicationResponse.from(app);
    }

    /**
     * Create a new application.
     */
    @Transactional
    public ApplicationResponse create(ApplicationRequest request) {
        String trimmedLink = request.getLink().trim();
        System.out.println("Creating application for link: " + trimmedLink);

        if (repository.findByLink(trimmedLink).isPresent()) {
            System.out.println("Duplicate found for link: " + trimmedLink);
            throw new com.example.demo.exception.DuplicateResourceException("Application with this link already exists");
        }

        Application app = new Application();
        app.setLink(trimmedLink);
        app.setCompany(request.getCompany());

        try {
            Application saved = repository.save(app);
            System.out.println("Application saved to DB with ID: " + saved.getId());
            return ApplicationResponse.from(saved);
        } catch (Exception e) {
            System.err.println("DB Save failed: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Update the status of an existing application.
     */
    @Transactional
    public ApplicationResponse updateStatus(Long id, StatusUpdateRequest request) {
        Application app = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));
        app.setStatus(request.getStatus().trim());
        Application updated = repository.save(app);
        return ApplicationResponse.from(updated);
    }

    /**
     * Delete an application by ID.
     */
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Application", id);
        }
        repository.deleteById(id);
    }
}
