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
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository repository;

    public ApplicationService(ApplicationRepository repository) {
        this.repository = repository;
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
     * Create a new application from request DTO.
     */
    @Transactional
    public ApplicationResponse create(ApplicationRequest request) {
        Application app = new Application();
        app.setLink(request.getLink().trim());
        Application saved = repository.save(app);
        return ApplicationResponse.from(saved);
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
