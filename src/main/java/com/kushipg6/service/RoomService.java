package com.kushipg6.service;

import com.kushipg6.dto.RoomResponseDTO;
import com.kushipg6.entity.PgBranch;
import com.kushipg6.entity.RentHistory;
import com.kushipg6.entity.Room;
import com.kushipg6.exception.ResourceNotFoundException;
import com.kushipg6.repository.PgBranchRepository;
import com.kushipg6.repository.RentHistoryRepository;
import com.kushipg6.repository.RoomRepository;
import com.kushipg6.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private RentHistoryRepository rentHistoryRepository;

    @Autowired
    private PgBranchRepository pgBranchRepository;

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<RoomResponseDTO> getAllRoomsWithVacancy() {
        return roomRepository.findAll().stream().map(room -> {
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

    public Room updateRent(Long roomId, double newRent) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room not found with id: " + roomId));

        RentHistory history = new RentHistory();
        history.setRoom(room);
        history.setOldRent(room.getRent());
        history.setNewRent(newRent);
        history.setChangedAt(LocalDate.now());
        rentHistoryRepository.save(history);

        room.setRent(newRent);
        return roomRepository.save(room);
    }

    public List<RentHistory> getRentHistory(Long roomId) {
        return rentHistoryRepository.findByRoomIdOrderByChangedAtDesc(roomId);
    }

    public Room assignBranch(Long roomId, Long branchId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room not found with id: " + roomId));
        PgBranch branch = pgBranchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch not found with id: " + branchId));
        room.setBranch(branch);
        return roomRepository.save(room);
    }

    public List<RoomResponseDTO> getRoomsByBranch(Long branchId) {
        return roomRepository.findByBranchId(branchId).stream().map(room -> {
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