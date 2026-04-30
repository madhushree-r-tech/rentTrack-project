package com.kushipg6.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {

    private String token;
    private String refreshToken;
    private String role;
    private String name;
    private String branchName;
}