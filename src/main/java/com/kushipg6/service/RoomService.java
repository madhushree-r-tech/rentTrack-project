package com.kushipg6.service;

import com.kushipg6.entity.Room;
import com.kushipg6.entity.RentHistory;
import com.kushipg6.exception.ResourceNotFoundException;
import com.kushipg6.repository.RentHistoryRepository;
import com.kushipg6.repository.RoomRepository;
import com.kushipg6.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RentHistoryRepository rentHistoryRepository;

    @Autowired
    private TenantRepository tenantRepository;

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room updateRent(Long roomId, double newRent) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room not found with id: " + roomId));

        RentHistory history = new RentHistory();
        history.setRoom(room);
        history.setOldRent(room.getRent());
        history.setNewRent(newRent);
        history.setChangedAt(LocalDateTime.now());
        rentHistoryRepository.save(history);

        room.setRent(newRent);
        return roomRepository.save(room);
    }

    public List<RentHistory> getRentHistory(Long roomId) {
        return rentHistoryRepository.findByRoomId(roomId);
    }

    public Room updateBranch(Long roomId, Long branchId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room not found with id: " + roomId));
        room.setBranch(null);
        return roomRepository.save(room);
    }

    public List<Room> getRoomsByBranch(Long branchId) {
        return roomRepository.findByBranchId(branchId);
    }

    public List<Room> getAvailableRooms() {
        List<Room> allRooms = roomRepository.findAll();
        return allRooms.stream()
                .filter(room -> {
                    int currentTenants = tenantRepository.findByRoomId(room.getId()).size();
                    return currentTenants < room.getCapacity();
                })
                .collect(Collectors.toList());
    }
}