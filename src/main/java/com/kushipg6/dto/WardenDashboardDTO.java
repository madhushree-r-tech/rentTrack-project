package com.kushipg6.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WardenDashboardDTO {

    private String branchName;
    private int totalRooms;
    private int occupiedRooms;
    private int vacantRooms;
    private int totalTenants;
    private double totalExpectedRent;
    private double totalCollectedRent;
    private double totalPendingRent;
    private List<String> unpaidTenants;
}