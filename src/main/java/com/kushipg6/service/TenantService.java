package com.kushipg6.service;

import com.kushipg6.entity.Room;
import com.kushipg6.entity.Tenant;
import com.kushipg6.exception.ResourceNotFoundException;
import com.kushipg6.exception.RoomFullException;
import com.kushipg6.repository.RoomRepository;
import com.kushipg6.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private RoomRepository roomRepository;

    public Tenant addTenant(Long roomId, String name, String phone) {

        // Step 1: Find the room
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room not found with id: " + roomId));

        // Step 2: Count existing tenants in room
        int currentTenants = tenantRepository.findByRoomId(roomId).size();

        // Step 3: Check if room is full
        if (currentTenants >= room.getCapacity()) {
            throw new RoomFullException(
                    "Room " + room.getRoomName() + " is full. Capacity: " + room.getCapacity());
        }

        // Step 4: Save tenant
        Tenant tenant = new Tenant();
        tenant.setName(name);
        tenant.setPhone(phone);
        tenant.setRoom(room);

        return tenantRepository.save(tenant);
    }

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }
}