package com.kushipg6.repository;

import com.kushipg6.entity.PgBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PgBranchRepository extends JpaRepository<PgBranch, Long> {
    Optional<PgBranch> findByBranchName(String branchName);
}