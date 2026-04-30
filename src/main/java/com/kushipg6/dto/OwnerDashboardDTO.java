package com.kushipg6.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDashboardDTO {

    // Combined summary across all branches
    private int totalBranches;
    private int totalTenants;
    private int totalRooms;
    private double combinedExpectedRent;
    private double combinedCollectedRent;
    private double combinedPendingRent;

    // Individual branch summaries
    private List<BranchSummaryDTO> branches;
}