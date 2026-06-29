package com.kushipg6.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tenantId;
    private String tenantName;
    private Long branchId;
    private String branchName;
    private String category;
    private String description;
    private String status = "OPEN";
    private String remarks;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;
}