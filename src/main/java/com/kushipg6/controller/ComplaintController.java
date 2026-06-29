package com.kushipg6.controller;

import com.kushipg6.entity.Complaint;
import com.kushipg6.entity.User;
import com.kushipg6.repository.UserRepository;
import com.kushipg6.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> raiseComplaint(
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String email = getEmailFromHeader(authHeader);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Long branchId = user.getBranch().getId();

            Long tenantId = body.get("tenantId") != null && !body.get("tenantId").isEmpty()
                    ? Long.parseLong(body.get("tenantId")) : null;

            return ResponseEntity.ok(complaintService.raiseComplaint(
                    tenantId, branchId, body.get("category"), body.get("description")));
        } catch (Exception e) {
            System.out.println("Error raising complaint: " + e.getMessage());
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyComplaints(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String email = getEmailFromHeader(authHeader);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Long branchId = user.getBranch().getId();
            System.out.println("Fetching complaints for branchId: " + branchId);
            List<Complaint> complaints = complaintService.getComplaintsByBranch(branchId);
            System.out.println("Found: " + complaints.size() + " complaints");
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            System.out.println("Error fetching complaints: " + e.getMessage());
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(complaintService.getAllComplaints());
        } catch (Exception e) {
            System.out.println("Error fetching all complaints: " + e.getMessage());
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(complaintService.updateStatus(
                    id, body.get("status"), body.get("remarks")));
        } catch (Exception e) {
            System.out.println("Error updating status: " + e.getMessage());
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    private String getEmailFromHeader(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String[] parts = token.split("\\.");
        String payload = new String(java.util.Base64.getDecoder().decode(parts[1]));
        String[] pairs = payload.replace("{", "").replace("}", "").replace("\"", "").split(",");
        for (String pair : pairs) {
            String[] kv = pair.split(":");
            if (kv[0].equals("sub")) return kv[1];
        }
        return null;
    }
}