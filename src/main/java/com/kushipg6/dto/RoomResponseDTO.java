package com.kushipg6.dto;

public class RoomResponseDTO {

    private Long id;
    private String roomName;
    private int capacity;
    private double rent;
    private int currentTenants;
    private int vacancy;

    public RoomResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public double getRent() { return rent; }
    public void setRent(double rent) { this.rent = rent; }

    public int getCurrentTenants() { return currentTenants; }
    public void setCurrentTenants(int currentTenants) { this.currentTenants = currentTenants; }

    public int getVacancy() { return vacancy; }
    public void setVacancy(int vacancy) { this.vacancy = vacancy; }
}