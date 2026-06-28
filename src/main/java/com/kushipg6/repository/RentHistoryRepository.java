package com.kushipg6.repository;

import com.kushipg6.entity.RentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RentHistoryRepository extends JpaRepository<RentHistory, Long> {
    List<RentHistory> findByRoomId(Long roomId);
}