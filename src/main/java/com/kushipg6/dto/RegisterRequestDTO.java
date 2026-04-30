package com.kushipg6.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;        // "ROLE_OWNER" or "ROLE_WARDEN"
    private String branchName;  // only for wardens
}