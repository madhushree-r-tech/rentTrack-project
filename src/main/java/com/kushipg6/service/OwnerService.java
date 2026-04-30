package com.kushipg6.service;

import com.kushipg6.dto.BranchSummaryDTO;
import com.kushipg6.dto.OwnerDashboardDTO;
import com.kushipg6.entity.PgBranch;
import com.kushipg6.entity.Room;
import com.kushipg6.entity.User;
import com.kushipg6.enums.PaymentStatus;
import com.kushipg6.enums.UserRole;
import com.kushipg6.repository.PaymentRepository;
import com.kushipg6.repository.PgBranchRepository;
import com.kushipg6.repository.RoomRepository;
import com.kushipg6.repository.TenantRepository;
import com.kushipg6.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OwnerService {

    @Autowired
    private PgBranchRepository pgBranchRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    public OwnerDashboardDTO getDashboard() {

        List<PgBranch> branches = pgBranchRepository.findAll();
        String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM-yyyy"));

        List<BranchSummaryDTO> branchSummaries = branches.stream()
                .map(branch -> getBranchSummary(branch, currentMonth))
                .collect(Collectors.toList());

        // Combined totals
        int totalTenants = branchSummaries.stream()
                .mapToInt(BranchSummaryDTO::getTotalTenants).sum();
        int totalRooms = branchSummaries.stream()
                .mapToInt(BranchSummaryDTO::getTotalRooms).sum();
        double combinedExpected = branchSummaries.stream()
                .mapToDouble(BranchSummaryDTO::getTotalExpectedRent).sum();
        double combinedCollected = branchSummaries.stream()
                .mapToDouble(BranchSummaryDTO::getTotalCollectedRent).sum();
        double combinedPending = branchSummaries.stream()
                .mapToDouble(BranchSummaryDTO::getTotalPendingRent).sum();

        return new OwnerDashboardDTO(
                branches.size(),
                totalTenants,
                totalRooms,
                combinedExpected,
                combinedCollected,
                combinedPending,
                branchSummaries
        );
    }

    private BranchSummaryDTO getBranchSummary(PgBranch branch, String currentMonth) {

        // Get warden for this branch
        Optional<User> warden = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.ROLE_WARDEN
                        && u.getBranch() != null
                        && u.getBranch().getId().equals(branch.getId()))
                .findFirst();

        String wardenName = warden.map(User::getName).orElse("Not assigned");
        String wardenPhone = warden.map(User::getPhone).orElse("N/A");
        String wardenEmail = warden.map(User::getEmail).orElse("N/A");

        // Get rooms for this branch
        List<Room> rooms = roomRepository.findByBranchId(branch.getId());
        int totalRooms = rooms.size();

        // Get tenants for this branch
        int totalTenants = rooms.stream()
                .mapToInt(room -> tenantRepository.findByRoomId(room.getId()).size())
                .sum();

        // Get vacancy
        int totalCapacity = rooms.stream().mapToInt(Room::getCapacity).sum();
        int totalVacancy = totalCapacity - totalTenants;

        // Expected rent = sum of all tenants' room rent
        double totalExpected = rooms.stream()
                .flatMap(room -> tenantRepository.findByRoomId(room.getId()).stream())
                .mapToDouble(tenant -> tenant.getRoom().getRent())
                .sum();

        // Collected rent for current month
        double totalCollected = paymentRepository
                .findByMonthAndStatus(currentMonth, PaymentStatus.PAID)
                .stream()
                .filter(p -> {
                    Room room = p.getTenant().getRoom();
                    return rooms.stream().anyMatch(r -> r.getId().equals(room.getId()));
                })
                .mapToDouble(p -> p.getAmountPaid())
                .sum();

        double totalPending = totalExpected - totalCollected;

        return new BranchSummaryDTO(
                branch.getBranchName(),
                wardenName,
                wardenPhone,
                wardenEmail,
                totalRooms,
                totalTenants,
                totalVacancy,
                totalExpected,
                totalCollected,
                totalPending
        );
    }
}