package com.kushipg6.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "tenants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = true)
    private String email;

    @Column(nullable = true)
    private String address;

    @Column(nullable = true)
    private String emergencyContact;

    @Column(nullable = true)
    private String profilePicture;

    @Column(nullable = true)
    private LocalDate joiningDate;

    @ManyToOne
    @JoinColumn(name = "room_id")
    @JsonIgnoreProperties({"capacity", "rent"})
    private Room room;
}