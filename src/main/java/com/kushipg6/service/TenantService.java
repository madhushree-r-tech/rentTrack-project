package com.kushipg6.service;

import com.kushipg6.dto.ProratedRentResponseDTO;
import com.kushipg6.entity.Room;
import com.kushipg6.entity.Tenant;
import com.kushipg6.exception.ResourceNotFoundException;
import com.kushipg6.exception.RoomFullException;
import com.kushipg6.repository.RoomRepository;
import com.kushipg6.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private RoomRepository roomRepository;

    public Tenant addTenant(Long roomId, String name, String phone, LocalDate joiningDate) {

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
        tenant.setRoom(room);
        tenant.setJoiningDate(joiningDate);

        return tenantRepository.save(tenant);
    }

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
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