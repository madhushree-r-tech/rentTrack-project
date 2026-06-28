package com.kushipg6.controller;

import com.kushipg6.dto.ProratedRentResponseDTO;
import com.kushipg6.dto.TenantPaymentHistoryDTO;
import com.kushipg6.dto.TenantRequestDTO;
import com.kushipg6.entity.Tenant;
import com.kushipg6.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Tenant> addTenant(
            @RequestParam("roomId") Long roomId,
            @RequestParam("name") String name,
            @RequestParam("phone") String phone,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "emergencyContact", required = false) String emergencyContact,
            @RequestParam(value = "joiningDate", required = false) String joiningDate,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture)
            throws IOException {

        LocalDate date = joiningDate != null ? LocalDate.parse(joiningDate) : null;
        Tenant saved = tenantService.addTenant(roomId, name, phone, email,
                address, emergencyContact, date, profilePicture);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Tenant>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTenantById(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(tenantService.getTenantById(id));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateTenant(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(tenantService.deactivateTenant(id));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
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

    @PutMapping(value = "/{id}/profile-picture", consumes = "multipart/form-data")
    public ResponseEntity<Tenant> updateProfilePicture(
            @PathVariable("id") Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(tenantService.updateProfilePicture(id, file));
    }

    @GetMapping("/{id}/payment-history")
    public ResponseEntity<?> getPaymentHistory(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(tenantService.getPaymentHistory(id));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}