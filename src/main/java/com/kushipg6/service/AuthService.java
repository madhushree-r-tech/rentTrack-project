package com.kushipg6.service;

import com.kushipg6.dto.AuthResponseDTO;
import com.kushipg6.dto.LoginRequestDTO;
import com.kushipg6.dto.RegisterRequestDTO;
import com.kushipg6.entity.PgBranch;
import com.kushipg6.entity.User;
import com.kushipg6.enums.UserRole;
import com.kushipg6.exception.ResourceNotFoundException;
import com.kushipg6.repository.PgBranchRepository;
import com.kushipg6.repository.UserRepository;
import com.kushipg6.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PgBranchRepository pgBranchRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponseDTO register(RegisterRequestDTO request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(UserRole.valueOf(request.getRole()));

        // If warden, link to branch
        if (request.getRole().equals("ROLE_WARDEN")) {
            PgBranch branch = pgBranchRepository.findByBranchName(request.getBranchName())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Branch not found: " + request.getBranchName()));
            user.setBranch(branch);
        }

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return new AuthResponseDTO(
                accessToken,
                refreshToken,
                user.getRole().name(),
                user.getName(),
                user.getBranch() != null ? user.getBranch().getBranchName() : "All Branches"
        );
    }

    public AuthResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return new AuthResponseDTO(
                accessToken,
                refreshToken,
                user.getRole().name(),
                user.getName(),
                user.getBranch() != null ? user.getBranch().getBranchName() : "All Branches"
        );
    }
}