package com.kushipg6.controller;

import com.kushipg6.entity.PgBranch;
import com.kushipg6.service.PgBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/branches")
public class PgBranchController {

    @Autowired
    private PgBranchService pgBranchService;

    // POST /api/branches → Add a branch
    @PostMapping
    public ResponseEntity<PgBranch> addBranch(@RequestBody PgBranch branch) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pgBranchService.addBranch(branch));
    }

    // GET /api/branches → Get all branches
    @GetMapping
    public ResponseEntity<List<PgBranch>> getAllBranches() {
        return ResponseEntity.ok(pgBranchService.getAllBranches());
    }

    // GET /api/branches/{id} → Get branch by id
    @GetMapping("/{id}")
    public ResponseEntity<PgBranch> getBranchById(
            @PathVariable("id") Long id) {
        return ResponseEntity.ok(pgBranchService.getBranchById(id));
    }
}