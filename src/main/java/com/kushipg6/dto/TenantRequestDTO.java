package com.kushipg6.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantRequestDTO {

    private Long roomId;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String emergencyContact;
    private LocalDate joiningDate;
}