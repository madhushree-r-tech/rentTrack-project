package com.kushipg6.repository;

import com.kushipg6.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByBranchIdOrderByCreatedAtDesc(Long branchId);
    List<Complaint> findAllByOrderByCreatedAtDesc();
}