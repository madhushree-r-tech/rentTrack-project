package com.kushipg6.controller;

import com.kushipg6.entity.Room;
import com.kushipg6.entity.RentHistory;
import com.kushipg6.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    @PutMapping("/{id}/rent")
    public ResponseEntity<Room> updateRent(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(roomService.updateRent(id, body.get("rent")));
    }

    @GetMapping("/{id}/rent-history")
    public ResponseEntity<List<RentHistory>> getRentHistory(
            @PathVariable("id") Long id) {
        return ResponseEntity.ok(roomService.getRentHistory(id));
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<Room>> getRoomsByBranch(
            @PathVariable("branchId") Long branchId) {
        return ResponseEntity.ok(roomService.getRoomsByBranch(branchId));
    }
}