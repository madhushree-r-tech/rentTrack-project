package com.kushipg6.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryDTO {

    private String month;
    private double totalExpected;
    private double totalCollected;
    private double pendingAmount;
}