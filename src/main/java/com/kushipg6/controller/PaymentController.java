package com.kushipg6.controller;

import com.kushipg6.dto.MonthlySummaryDTO;
import com.kushipg6.dto.PaymentRequestDTO;
import com.kushipg6.entity.Payment;
import com.kushipg6.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> recordPayment(@RequestBody PaymentRequestDTO request) {
        Payment saved = paymentService.recordPayment(
                request.getTenantId(),
                request.getAmountPaid(),
                request.getMonth(),
                request.getStatus()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/summary")
    public ResponseEntity<MonthlySummaryDTO> getMonthlySummary(
            @RequestParam("month") String month) {
        return ResponseEntity.ok(paymentService.getMonthlySummary(month));
    }
}