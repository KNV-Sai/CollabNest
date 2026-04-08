package server.controller;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import server.model.Role;
import server.model.Task;
import server.model.TaskStatus;
import server.model.User;
import server.service.TaskService;
import server.service.UserService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Task task, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Task created = taskService.create(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/my")
    public ResponseEntity<?> createMyTask(@RequestBody Map<String, String> body, Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        if (user.getRole() != Role.STUDENT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only students can create personal project tasks");
        }

        String projectIdRaw = body.get("projectId");
        String name = body.get("name");
        String description = body.get("description");
        String dueDateRaw = body.get("dueDate");

        if (projectIdRaw == null || projectIdRaw.isBlank()) {
            return ResponseEntity.badRequest().body("Project is required");
        }
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body("Task name is required");
        }

        Long projectId;
        try {
            projectId = Long.parseLong(projectIdRaw);
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().body("Invalid project id");
        }

        LocalDate dueDate = null;
        if (dueDateRaw != null && !dueDateRaw.isBlank()) {
            try {
                dueDate = LocalDate.parse(dueDateRaw);
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body("Invalid due date format");
            }
        }

        return taskService.createForStudent(user, projectId, name.trim(), description, dueDate)
            .<ResponseEntity<?>>map(created -> ResponseEntity.status(HttpStatus.CREATED).body(created))
            .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only add tasks to projects you are assigned to"));
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAll(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(taskService.getAll());
    }

    // Get tasks assigned to the current logged-in user
    @GetMapping("/my-tasks")
    public ResponseEntity<List<Task>> getMyTasks(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        User user = userService.getByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(taskService.getTasksByAssignee(user.getId()));
    }

    // Get all tasks for a specific project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getByProject(@PathVariable Long projectId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (user.getRole() == Role.STUDENT && !taskService.isUserAssignedToProject(user.getId(), projectId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        return taskService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task task, Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (user.getRole() == Role.STUDENT && !taskService.isTaskAssignedToUser(id, user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return taskService.update(id, task)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Convenience PATCH endpoint for status-only updates from student UI
    @PutMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (user.getRole() == Role.STUDENT && !taskService.isTaskAssignedToUser(id, user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            TaskStatus status = TaskStatus.valueOf(statusStr);
            Task partial = new Task();
            partial.setStatus(status);
            return taskService.update(id, partial)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return userService.getByEmail(authentication.getName()).orElse(null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return taskService.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    private boolean isAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return userService.getByEmail(authentication.getName())
            .map(user -> user.getRole() == Role.ADMIN)
            .orElse(false);
    }
}
