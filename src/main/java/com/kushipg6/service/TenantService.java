package com.kushipg6.service;

import com.kushipg6.dto.ProratedRentResponseDTO;
import com.kushipg6.dto.TenantPaymentHistoryDTO;
import com.kushipg6.entity.Payment;
import com.kushipg6.entity.Room;
import com.kushipg6.entity.Tenant;
import com.kushipg6.exception.ResourceNotFoundException;
import com.kushipg6.exception.RoomFullException;
import com.kushipg6.repository.PaymentRepository;
import com.kushipg6.repository.RoomRepository;
import com.kushipg6.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private PaymentRepository paymentRepository;

    public Tenant addTenant(Long roomId, String name, String phone,
                            String email, String address, String emergencyContact,
                            LocalDate joiningDate, MultipartFile profilePicture) throws IOException {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room not found with id: " + roomId));

        int currentTenants = tenantRepository.findByRoomId(roomId).size();

        if (currentTenants >= room.getCapacity()) {
            throw new RoomFullException(
                    "Room " + room.getRoomName() + " is full. Capacity: " + room.getCapacity());
        }

        Tenant tenant = new Tenant();
        tenant.setName(name);
        tenant.setPhone(phone);
        tenant.setEmail(email);
        tenant.setAddress(address);
        tenant.setEmergencyContact(emergencyContact);
        tenant.setRoom(room);
        tenant.setJoiningDate(joiningDate);

        if (profilePicture != null && !profilePicture.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(profilePicture);
            tenant.setProfilePicture(imageUrl);
        }

        return tenantRepository.save(tenant);
    }

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    public Tenant getTenantById(Long tenantId) {
        return tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tenant not found with id: " + tenantId));
    }

    public Tenant transferTenant(Long tenantId, Long newRoomId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tenant not found with id: " + tenantId));

        Room newRoom = roomRepository.findById(newRoomId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room not found with id: " + newRoomId));

        int currentTenants = tenantRepository.findByRoomId(newRoomId).size();
        if (currentTenants >= newRoom.getCapacity()) {
            throw new RoomFullException(
                    "Room " + newRoom.getRoomName() + " is full. Capacity: " + newRoom.getCapacity());
        }

        tenant.setRoom(newRoom);
        return tenantRepository.save(tenant);
    }

    public Tenant updateJoiningDate(Long tenantId, LocalDate joiningDate) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tenant not found with id: " + tenantId));
        tenant.setJoiningDate(joiningDate);
        return tenantRepository.save(tenant);
    }

    public Tenant updateProfilePicture(Long tenantId, MultipartFile file) throws IOException {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tenant not found with id: " + tenantId));
        String imageUrl = cloudinaryService.uploadImage(file);
        tenant.setProfilePicture(imageUrl);
        return tenantRepository.save(tenant);
    }

    public List<TenantPaymentHistoryDTO> getPaymentHistory(Long tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tenant not found with id: " + tenantId));

        List<TenantPaymentHistoryDTO> history = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            LocalDate date = LocalDate.now().minusMonths(i);
            String month = date.format(DateTimeFormatter.ofPattern("MMMM-yyyy"));

            List<Payment> payments = paymentRepository.findByMonth(month)
                    .stream()
                    .filter(p -> p.getTenant().getId().equals(tenantId))
                    .collect(Collectors.toList());

            if (!payments.isEmpty()) {
                Payment p = payments.get(0);
                history.add(new TenantPaymentHistoryDTO(
                        month,
                        p.getStatus().name(),
                        p.getAmountPaid()
                ));
            } else {
                history.add(new TenantPaymentHistoryDTO(
                        month,
                        "UNPAID",
                        tenant.getRoom().getRent()
                ));
            }
        }

        return history;
    }

    public ProratedRentResponseDTO calculateProratedRent(Long tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tenant not found with id: " + tenantId));

        LocalDate joiningDate = tenant.getJoiningDate();

        if (joiningDate == null) {
            throw new ResourceNotFoundException(
                    "Joining date not set for tenant: " + tenant.getName());
        }

        double fullRent = tenant.getRoom().getRent();
        YearMonth yearMonth = YearMonth.of(joiningDate.getYear(), joiningDate.getMonth());
        int daysInMonth = yearMonth.lengthOfMonth();
        int daysStayed = daysInMonth - joiningDate.getDayOfMonth() + 1;
        double proratedRent = (fullRent / daysInMonth) * daysStayed;
        proratedRent = Math.round(proratedRent * 100.0) / 100.0;

        return new ProratedRentResponseDTO(
                tenant.getName(),
                tenant.getRoom().getRoomName(),
                joiningDate,
                fullRent,
                daysInMonth,
                daysStayed,
                proratedRent
        );
    }
}