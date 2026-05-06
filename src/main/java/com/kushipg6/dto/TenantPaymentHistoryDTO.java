package com.kushipg6.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantPaymentHistoryDTO {
    private String month;
    private String status;
    private double amount;
}