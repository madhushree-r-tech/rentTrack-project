package com.kushipg6.controller;

import com.kushipg6.dto.ProratedRentResponseDTO;
import com.kushipg6.dto.TenantRequestDTO;
import com.kushipg6.entity.Tenant;
import com.kushipg6.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @PostMapping
    public ResponseEntity<Tenant> addTenant(@RequestBody TenantRequestDTO request) {
        Tenant saved = tenantService.addTenant(
                request.getRoomId(),
                request.getName(),
                request.getPhone(),
                request.getJoiningDate()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Tenant>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    @GetMapping("/{id}/prorated-rent")
    public ResponseEntity<ProratedRentResponseDTO> getProratedRent(
            @PathVariable("id") Long id) {
        return ResponseEntity.ok(tenantService.calculateProratedRent(id));
    }

    @PutMapping("/{id}/transfer")
    public ResponseEntity<Tenant> transferTenant(
            @PathVariable("id") Long id,
            @RequestParam("newRoomId") Long newRoomId) {
        return ResponseEntity.ok(tenantService.transferTenant(id, newRoomId));
    }

    @PutMapping("/{id}/joining-date")
    public ResponseEntity<Tenant> updateJoiningDate(
            @PathVariable("id") Long id,
            @RequestBody TenantRequestDTO request) {
        return ResponseEntity.ok(tenantService.updateJoiningDate(id, request.getJoiningDate()));
    }
}