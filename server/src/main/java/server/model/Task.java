package server.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Store as "title" in DB but expose as "name" to match frontend
    @Column(name = "title")
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    // Store as "deadline" in DB but expose as "dueDate" to match frontend
    @Column(name = "deadline")
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonIgnoreProperties({"tasks", "users"})
    private Project project;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    @JsonIgnoreProperties({"projects", "tasks", "password"})
    private User assignee;
}
