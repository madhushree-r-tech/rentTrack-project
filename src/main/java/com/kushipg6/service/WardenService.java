package com.kushipg6.service;

import com.kushipg6.dto.WardenDashboardDTO;
import com.kushipg6.entity.Payment;
import com.kushipg6.entity.Room;
import com.kushipg6.entity.Tenant;
import com.kushipg6.entity.User;
import com.kushipg6.enums.PaymentStatus;
import com.kushipg6.exception.ResourceNotFoundException;
import com.kushipg6.repository.PaymentRepository;
import com.kushipg6.repository.RoomRepository;
import com.kushipg6.repository.TenantRepository;
import com.kushipg6.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WardenService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public WardenDashboardDTO getDashboard(String wardenEmail) {

        User warden = userRepository.findByEmail(wardenEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Warden not found: " + wardenEmail));

        if (warden.getBranch() == null) {
            throw new ResourceNotFoundException(
                    "Warden is not assigned to any branch!");
        }

        Long branchId = warden.getBranch().getId();
        String branchName = warden.getBranch().getBranchName();
        String currentMonth = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("MMMM-yyyy"));

        List<Room> rooms = roomRepository.findByBranchId(branchId);
        int totalRooms = rooms.size();

        List<Tenant> allTenants = rooms.stream()
                .flatMap(room -> tenantRepository.findByRoomId(room.getId()).stream())
                .collect(Collectors.toList());
        int totalTenants = allTenants.size();

        int occupiedRooms = (int) rooms.stream()
                .filter(room -> !tenantRepository.findByRoomId(room.getId()).isEmpty())
                .count();
        int vacantRooms = totalRooms - occupiedRooms;

        double totalExpected = allTenants.stream()
                .mapToDouble(t -> t.getRoom().getRent())
                .sum();

        List<Payment> paidPayments = paymentRepository
                .findByMonthAndStatus(currentMonth, PaymentStatus.PAID)
                .stream()
                .filter(p -> rooms.stream()
                        .anyMatch(r -> r.getId().equals(p.getTenant().getRoom().getId())))
                .collect(Collectors.toList());

        double totalCollected = paidPayments.stream()
                .mapToDouble(Payment::getAmountPaid)
                .sum();

        double totalPending = totalExpected - totalCollected;

        List<String> paidTenantNames = paidPayments.stream()
                .map(p -> p.getTenant().getName())
                .collect(Collectors.toList());

        List<String> unpaidTenants = allTenants.stream()
                .filter(t -> !paidTenantNames.contains(t.getName()))
                .map(Tenant::getName)
                .collect(Collectors.toList());

        return new WardenDashboardDTO(
                branchName,
                totalRooms,
                occupiedRooms,
                vacantRooms,
                totalTenants,
                totalExpected,
                totalCollected,
                totalPending,
                unpaidTenants
        );
    }
}