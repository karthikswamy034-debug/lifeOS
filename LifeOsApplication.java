package com.lifeos;

import com.lifeos.model.*;
import com.lifeos.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LifeOsApplication {

    public static void main(String[] args) {
        SpringApplication.run(LifeOsApplication.class, args);
    }

    @Bean
    CommandLineRunner seedDatabase(
            TaskRepository taskRepo,
            HabitRepository habitRepo,
            StudyPlanRepository studyRepo,
            DocumentRepository docRepo,
            UserRepository userRepo
    ) {
        return args -> {
            if (userRepo.count() == 0) {
                userRepo.save(new User("Alex Mercer", "alex.mercer@lifeos.internal", "encrypted_hash_2026"));
            }

            if (taskRepo.count() == 0) {
                taskRepo.save(new Task("Complete Java practice", "Java", "urgent", false, "Today"));
                taskRepo.save(new Task("Solve DSA problems", "DSA", "high", false, "Today"));
                taskRepo.save(new Task("Workout", "Health", "high", true, "Today"));
                taskRepo.save(new Task("Revise college notes", "College", "high", false, "Today"));
            }

            if (habitRepo.count() == 0) {
                habitRepo.save(new Habit("Coding", "Engineering", 14, true, 92));
                habitRepo.save(new Habit("Workout", "Fitness", 8, true, 80));
                habitRepo.save(new Habit("Reading", "Mindset", 21, false, 86));
                habitRepo.save(new Habit("Meditation", "Mental Health", 12, true, 94));
                habitRepo.save(new Habit("Sleep (7.5h+)", "Recovery", 9, true, 84));
                habitRepo.save(new Habit("Learning Goals", "Academics", 18, false, 88));
            }

            if (docRepo.count() == 0) {
                docRepo.save(new DocumentItem(
                        "Operating Systems.pdf",
                        "College",
                        "2.4 MB",
                        42,
                        "CPU scheduling, Process Synchronization, Deadlock Coffman conditions & Banker's Algorithm",
                        "Unit 3: Deadlocks. Four Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
                        "[\"OS\", \"Deadlock\", \"Concurrency\"]"
                ));
                docRepo.save(new DocumentItem(
                        "DSA Notes.pdf",
                        "College",
                        "3.8 MB",
                        58,
                        "Core Data Structures, Big-O, Binary Search Trees, Graph BFS/DFS, Dijkstra, Dynamic Programming",
                        "DSA handbook covering Floyd's cycle detection and DP knapsack recurrence.",
                        "[\"DSA\", \"Algorithms\", \"Trees\"]"
                ));
                docRepo.save(new DocumentItem(
                        "Resume.pdf",
                        "Career",
                        "420 KB",
                        2,
                        "Full Stack Software Engineer resume specializing in Java Spring Boot and React",
                        "Alex Mercer - Senior Software Engineer. Experience with Spring Boot, microservices, and React.",
                        "[\"Career\", \"CV\", \"Java\"]"
                ));
            }
        };
    }
}
