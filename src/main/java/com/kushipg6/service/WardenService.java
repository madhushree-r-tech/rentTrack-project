package com.kushipg6.service;

import com.kushipg6.dto.UnpaidTenantInfo;
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
import java.util.Map;
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

    public WardenDashboardDTO getDashboard(String wardenEmail, String month) {

        User warden = userRepository.findByEmail(wardenEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Warden not found: " + wardenEmail));

        if (warden.getBranch() == null) {
            throw new ResourceNotFoundException(
                    "Warden is not assigned to any branch!");
        }

        Long branchId = warden.getBranch().getId();
        String branchName = warden.getBranch().getBranchName();

        String selectedMonth = (month != null && !month.isEmpty())
                ? month
                : LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM-yyyy"));

        // Get all rooms in one query
        List<Room> rooms = roomRepository.findByBranchId(branchId);
        int totalRooms = rooms.size();

        // Get all tenants in one query
        List<Long> roomIds = rooms.stream().map(Room::getId).collect(Collectors.toList());
        List<Tenant> allTenants = tenantRepository.findByRoomIdIn(roomIds);
        int totalTenants = allTenants.size();

        // Group tenants by room
        Map<Long, List<Tenant>> tenantsByRoom = allTenants.stream()
                .collect(Collectors.groupingBy(t -> t.getRoom().getId()));

        int occupiedRooms = (int) rooms.stream()
                .filter(room -> tenantsByRoom.containsKey(room.getId()))
                .count();

        // Vacancy = total beds - total tenants
        int totalBeds = rooms.stream().mapToInt(Room::getCapacity).sum();
        int vacantBeds = totalBeds - totalTenants;

        double totalExpected = allTenants.stream()
                .mapToDouble(t -> t.getRoom().getRent())
                .sum();

        // Get paid payments in one query
        List<Payment> paidPayments = paymentRepository
                .findByMonthAndStatus(selectedMonth, PaymentStatus.PAID)
                .stream()
                .filter(p -> roomIds.contains(p.getTenant().getRoom().getId()))
                .collect(Collectors.toList());

        double totalCollected = paidPayments.stream()
                .mapToDouble(Payment::getAmountPaid)
                .sum();

        double totalPending = totalExpected - totalCollected;

        List<String> paidTenantNames = paidPayments.stream()
                .map(p -> p.getTenant().getName())
                .collect(Collectors.toList());

        List<UnpaidTenantInfo> unpaidTenants = allTenants.stream()
                .filter(t -> !paidTenantNames.contains(t.getName()))
                .map(t -> new UnpaidTenantInfo(
                        t.getName(),
                        t.getPhone(),
                        t.getRoom().getRoomName()
                ))
                .collect(Collectors.toList());

        return new WardenDashboardDTO(
                branchName,
                selectedMonth,
                totalRooms,
                occupiedRooms,
                vacantBeds,
                totalTenants,
                totalExpected,
                totalCollected,
                totalPending,
                unpaidTenants
        );
    }
}