package com.kushipg6.service;

import com.kushipg6.entity.PgBranch;
import com.kushipg6.exception.ResourceNotFoundException;
import com.kushipg6.repository.PgBranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PgBranchService {

    @Autowired
    private PgBranchRepository pgBranchRepository;

    public PgBranch addBranch(PgBranch branch) {
        return pgBranchRepository.save(branch);
    }

    public List<PgBranch> getAllBranches() {
        return pgBranchRepository.findAll();
    }

    public PgBranch getBranchById(Long id) {
        return pgBranchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch not found with id: " + id));
    }
}