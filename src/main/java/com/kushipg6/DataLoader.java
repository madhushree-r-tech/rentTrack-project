package com.kushipg6;

import com.kushipg6.entity.PgBranch;
import com.kushipg6.entity.Room;
import com.kushipg6.repository.PgBranchRepository;
import com.kushipg6.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PgBranchRepository pgBranchRepository;

    @Override
    public void run(String... args) throws Exception {

        if (roomRepository.count() > 0) return;

        PgBranch branch = pgBranchRepository.findByBranchName("Kushi PG 6")
                .orElse(null);
        if (branch == null) return;

        for (int floor = 1; floor <= 5; floor++) {
            String f = String.valueOf(floor);

            // 101/201/301/401/501 - A,B,C,D → 3 sharing ₹9000
            for (String s : new String[]{"A", "B", "C", "D"}) {
                save(f + "01" + s, 3, 9000, branch);
            }

            // 102 - A,B,C,D → 3 sharing ₹9000
            for (String s : new String[]{"A", "B", "C", "D"}) {
                save(f + "02" + s, 3, 9000, branch);
            }

            // 103
            save(f + "03A", 3, 9000, branch);
            save(f + "03B", 3, 9000, branch);
            save(f + "03C", 2, 10000, branch);
            save(f + "03D", 3, 9000, branch);

            // 104
            save(f + "04A", 4, 8000, branch);
            save(f + "04B", 3, 9000, branch);
            save(f + "04C", 2, 10000, branch);
            save(f + "04D", 2, 10000, branch);
            save(f + "04E", 1, 11000, branch);

            // 105
            save(f + "05A", 4, 8000, branch);
            save(f + "05B", 4, 8000, branch);
            save(f + "05C", 2, 10000, branch);
            save(f + "05D", 2, 10000, branch);

            // 106
            save(f + "06A", 3, 9000, branch);
            save(f + "06B", 3, 9000, branch);
            save(f + "06C", 2, 10000, branch);
            save(f + "06D", 1, 11000, branch);
        }

        System.out.println("✅ All 125 rooms loaded successfully!");
    }

    private void save(String roomName, int capacity, double rent, PgBranch branch) {
        Room room = new Room();
        room.setRoomName(roomName);
        room.setCapacity(capacity);
        room.setRent(rent);
        room.setBranch(branch);
        roomRepository.save(room);
    }
}