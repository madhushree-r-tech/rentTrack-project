package com.kushipg6.controller;

import com.kushipg6.dto.MonthlySummaryDTO;
import com.kushipg6.entity.Payment;
import com.kushipg6.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // POST /api/payments → Record a payment
    @PostMapping
    public ResponseEntity<Payment> recordPayment(@RequestBody Map<String, String> request) {
        Long tenantId = Long.parseLong(request.get("tenantId"));
        double amountPaid = Double.parseDouble(request.get("amountPaid"));
        String month = request.get("month");
        Payment saved = paymentService.recordPayment(tenantId, amountPaid, month);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET /api/payments → Get all payments
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // GET /api/payments/summary?month=April-2026
    @GetMapping("/summary")
    public ResponseEntity<MonthlySummaryDTO> getMonthlySummary(@RequestParam String month) {
        return ResponseEntity.ok(paymentService.getMonthlySummary(month));
    }
}