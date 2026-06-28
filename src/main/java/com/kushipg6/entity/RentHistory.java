package com.kushipg6.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rent_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private double oldRent;

    @Column(nullable = false)
    private double newRent;

    @Column(nullable = false)
    private LocalDateTime changedAt;
}