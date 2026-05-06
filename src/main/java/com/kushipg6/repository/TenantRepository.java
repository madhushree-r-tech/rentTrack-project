package com.kushipg6.repository;

import com.kushipg6.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    List<Tenant> findByRoomId(Long roomId);
    List<Tenant> findByRoomIdIn(List<Long> roomIds);
}