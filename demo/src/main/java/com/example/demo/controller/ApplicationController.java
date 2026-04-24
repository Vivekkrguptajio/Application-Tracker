package com.example.demo.controller;

import com.example.demo.entity.Application;
import com.example.demo.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin("*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository repository;

    @PostMapping
    public Application saveApplication(@RequestBody Application application) {
        return repository.save(application);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return repository.findAll();
    }
}