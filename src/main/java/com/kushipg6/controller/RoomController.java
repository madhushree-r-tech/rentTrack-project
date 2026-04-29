package com.kushipg6.controller;

import com.kushipg6.dto.RentUpdateRequestDTO;
import com.kushipg6.dto.RoomResponseDTO;
import com.kushipg6.entity.RentHistory;
import com.kushipg6.entity.Room;
import com.kushipg6.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity<Room> addRoom(@RequestBody Room room) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.addRoom(room));
    }

    @GetMapping
    public ResponseEntity<List<RoomResponseDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRoomsWithVacancy());
    }

    @PutMapping("/{id}/rent")
    public ResponseEntity<Room> updateRent(
            @PathVariable("id") Long id,
            @RequestBody RentUpdateRequestDTO request) {
        return ResponseEntity.ok(roomService.updateRent(id, request.getNewRent()));
    }

    @GetMapping("/{id}/rent-history")
    public ResponseEntity<List<RentHistory>> getRentHistory(
            @PathVariable("id") Long id) {
        return ResponseEntity.ok(roomService.getRentHistory(id));
    }

    @PutMapping("/{id}/branch")
    public ResponseEntity<Room> assignBranch(
            @PathVariable("id") Long id,
            @RequestParam("branchId") Long branchId) {
        return ResponseEntity.ok(roomService.assignBranch(id, branchId));
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<RoomResponseDTO>> getRoomsByBranch(
            @PathVariable("branchId") Long branchId) {
        return ResponseEntity.ok(roomService.getRoomsByBranch(branchId));
    }
}