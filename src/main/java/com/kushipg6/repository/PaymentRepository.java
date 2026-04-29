package com.kushipg6.repository;

import com.kushipg6.entity.Payment;
import com.kushipg6.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByMonth(String month);
    List<Payment> findByMonthAndStatus(String month, PaymentStatus status);
}