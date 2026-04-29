package com.kushipg6.dto;

import com.kushipg6.enums.PaymentStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {

    private Long tenantId;
    private double amountPaid;
    private String month;
    private PaymentStatus status; // send "PAID" or "UNPAID"
}