package com.kushipg6.controller;

import com.kushipg6.dto.WardenDashboardDTO;
import com.kushipg6.service.WardenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warden")
public class WardenController {

    @Autowired
    private WardenService wardenService;

    @GetMapping("/dashboard")
    public ResponseEntity<WardenDashboardDTO> getDashboard(
            Authentication authentication,
            @RequestParam(value = "month", required = false) String month) {
        String wardenEmail = authentication.getName();
        return ResponseEntity.ok(wardenService.getDashboard(wardenEmail, month));
    }
}