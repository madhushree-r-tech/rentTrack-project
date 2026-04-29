package com.kushipg6.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;
    private int capacity;
    private double rent;

    public Room() {}

    public Room(Long id, String roomName, int capacity, double rent) {
        this.id = id;
        this.roomName = roomName;
        this.capacity = capacity;
        this.rent = rent;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public double getRent() { return rent; }
    public void setRent(double rent) { this.rent = rent; }
}