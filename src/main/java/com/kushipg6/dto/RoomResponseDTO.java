package com.kushipg6.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponseDTO {

    private Long id;
    private String roomName;
    private int capacity;
    private double rent;
    private int currentTenants;
    private int vacancy;
}