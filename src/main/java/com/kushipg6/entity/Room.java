package com.kushipg6.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomName;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private double rent;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = true)
    @JsonIgnoreProperties({"address", "totalFloors"})
    private PgBranch branch;
}