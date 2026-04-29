package com.kushipg6.dto;

public class MonthlySummaryDTO {

    private String month;
    private double totalExpected;
    private double totalCollected;
    private double pendingAmount;

    public MonthlySummaryDTO() {}

    public MonthlySummaryDTO(String month, double totalExpected,
                              double totalCollected, double pendingAmount) {
        this.month = month;
        this.totalExpected = totalExpected;
        this.totalCollected = totalCollected;
        this.pendingAmount = pendingAmount;
    }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public double getTotalExpected() { return totalExpected; }
    public void setTotalExpected(double totalExpected) { this.totalExpected = totalExpected; }

    public double getTotalCollected() { return totalCollected; }
    public void setTotalCollected(double totalCollected) { this.totalCollected = totalCollected; }

    public double getPendingAmount() { return pendingAmount; }
    public void setPendingAmount(double pendingAmount) { this.pendingAmount = pendingAmount; }
}