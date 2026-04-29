package com.kushipg6.controller;

import com.kushipg6.dto.RoomResponseDTO;
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

    // POST /api/rooms → Add a new room
    @PostMapping
    public ResponseEntity<Room> addRoom(@RequestBody Room room) {
        Room saved = roomService.addRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET /api/rooms → Get all rooms with vacancy
    @GetMapping
    public ResponseEntity<List<RoomResponseDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRoomsWithVacancy());
    }
}