package com.kushipg6.controller;

import com.kushipg6.entity.Tenant;
import com.kushipg6.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    // POST /api/tenants → Add tenant to a room
    @PostMapping
    public ResponseEntity<Tenant> addTenant(@RequestBody Map<String, String> request) {
        Long roomId = Long.parseLong(request.get("roomId"));
        String name = request.get("name");
        String phone = request.get("phone");
        Tenant saved = tenantService.addTenant(roomId, name, phone);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET /api/tenants → Get all tenants
    @GetMapping
    public ResponseEntity<List<Tenant>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }
}