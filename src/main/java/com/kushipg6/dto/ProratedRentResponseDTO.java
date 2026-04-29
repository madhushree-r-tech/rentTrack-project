package com.kushipg6.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProratedRentResponseDTO {

    private String tenantName;
    private String roomName;
    private LocalDate joiningDate;
    private double fullRent;
    private int daysInMonth;
    private int daysStayed;
    private double proratedRent;
}