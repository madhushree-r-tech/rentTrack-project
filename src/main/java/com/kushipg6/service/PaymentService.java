package com.kushipg6.service;

import com.kushipg6.dto.MonthlySummaryDTO;
import com.kushipg6.entity.Payment;
import com.kushipg6.entity.Tenant;
import com.kushipg6.enums.PaymentStatus;
import com.kushipg6.exception.ResourceNotFoundException;
import com.kushipg6.repository.PaymentRepository;
import com.kushipg6.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TenantRepository tenantRepository;

    // Record a payment
    public Payment recordPayment(Long tenantId, double amountPaid, String month, PaymentStatus status) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tenant not found with id: " + tenantId));

        Payment payment = new Payment();
        payment.setTenant(tenant);
        payment.setAmountPaid(amountPaid);
        payment.setMonth(month);
        payment.setStatus(PaymentStatus.PAID);

        return paymentRepository.save(payment);
    }

    // Get all payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Get monthly summary
    public MonthlySummaryDTO getMonthlySummary(String month) {

        // Total expected = sum of rent of all tenants
        List<Tenant> allTenants = tenantRepository.findAll();
        double totalExpected = allTenants.stream()
                .mapToDouble(t -> t.getRoom().getRent())
                .sum();

        // Total collected = sum of amountPaid where status=PAID
        List<Payment> paidPayments = paymentRepository
                .findByMonthAndStatus(month, PaymentStatus.PAID);
        double totalCollected = paidPayments.stream()
                .mapToDouble(Payment::getAmountPaid)
                .sum();

        double pendingAmount = totalExpected - totalCollected;

        return new MonthlySummaryDTO(month, totalExpected, totalCollected, pendingAmount);
    }
}