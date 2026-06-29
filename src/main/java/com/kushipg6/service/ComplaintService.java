package com.kushipg6.service;

import com.kushipg6.entity.Complaint;
import com.kushipg6.entity.PgBranch;
import com.kushipg6.entity.Tenant;
import com.kushipg6.exception.ResourceNotFoundException;
import com.kushipg6.repository.ComplaintRepository;
import com.kushipg6.repository.PgBranchRepository;
import com.kushipg6.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PgBranchRepository pgBranchRepository;

    public Complaint raiseComplaint(Long tenantId, Long branchId, String category, String description) {
        PgBranch branch = pgBranchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        Complaint complaint = new Complaint();
        complaint.setBranchId(branchId);
        complaint.setBranchName(branch.getBranchName());
        complaint.setCategory(category);
        complaint.setDescription(description);
        complaint.setStatus("OPEN");
        complaint.setCreatedAt(LocalDateTime.now());

        if (tenantId != null) {
            Tenant tenant = tenantRepository.findById(tenantId).orElse(null);
            if (tenant != null) {
                complaint.setTenantId(tenantId);
                complaint.setTenantName(tenant.getName());
            }
        }

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getComplaintsByBranch(Long branchId) {
        return complaintRepository.findByBranchIdOrderByCreatedAtDesc(branchId);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    public Complaint updateStatus(Long complaintId, String status, String remarks) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        complaint.setStatus(status);
        complaint.setRemarks(remarks);
        if (status.equals("RESOLVED")) {
            complaint.setResolvedAt(LocalDateTime.now());
        }
        return complaintRepository.save(complaint);
    }
}