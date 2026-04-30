package com.kushipg6.controller;

import com.kushipg6.dto.OwnerDashboardDTO;
import com.kushipg6.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    // GET /api/owner/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<OwnerDashboardDTO> getDashboard() {
        return ResponseEntity.ok(ownerService.getDashboard());
    }
}