package com.kushipg6.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pg_branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PgBranch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String branchName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private int totalFloors;
}