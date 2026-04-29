package com.kushipg6.service;

import com.kushipg6.dto.RoomResponseDTO;
import com.kushipg6.entity.Room;
import com.kushipg6.repository.RoomRepository;
import com.kushipg6.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private TenantRepository tenantRepository;

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<RoomResponseDTO> getAllRoomsWithVacancy() {
        List<Room> rooms = roomRepository.findAll();

        return rooms.stream().map(room -> {
            int currentTenants = tenantRepository.findByRoomId(room.getId()).size();
            RoomResponseDTO dto = new RoomResponseDTO();
            dto.setId(room.getId());
            dto.setRoomName(room.getRoomName());
            dto.setCapacity(room.getCapacity());
            dto.setRent(room.getRent());
            dto.setCurrentTenants(currentTenants);
            dto.setVacancy(room.getCapacity() - currentTenants);
            return dto;
        }).collect(Collectors.toList());
    }
}