package com.kushipg6.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BranchSummaryDTO {

    private String branchName;
    private String wardenName;
    private String wardenPhone;
    private String wardenEmail;
    private int totalRooms;
    private int totalTenants;
    private int totalVacancy;
    private double totalExpectedRent;
    private double totalCollectedRent;
    private double totalPendingRent;
}