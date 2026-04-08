package server.controller;

import java.util.List;
import java.util.Map;

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

import server.model.Project;
import server.model.Role;
import server.model.User;
import server.service.ProjectService;
import server.service.UserService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Project> create(@RequestBody Project project, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Project created = projectService.create(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAll(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(projectService.getAll());
    }

    @GetMapping("/my-projects")
    public ResponseEntity<List<Project>> getMyProjects(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        User user = userService.getByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(projectService.getProjectsByUser(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) {
        return projectService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> update(@PathVariable Long id, @RequestBody Project project, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return projectService.update(id, project)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{projectId}/assign-student")
    public ResponseEntity<?> assignStudent(@PathVariable Long projectId, @RequestBody Map<String, Long> body, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            Long studentId = body.get("studentId");
            if (studentId == null) {
                return ResponseEntity.badRequest().build();
            }

            // Get the project
            Project project = projectService.getById(projectId).orElse(null);
            if (project == null) {
                return ResponseEntity.notFound().build();
            }

            // Get the student
            User student = userService.getById(studentId).orElse(null);
            if (student == null) {
                return ResponseEntity.notFound().build();
            }

            if (student.getRole() != Role.STUDENT) {
                return ResponseEntity.badRequest().body("Only students can be assigned to projects");
            }

            // Assign the student
            boolean assigned = projectService.assignStudent(projectId, studentId);
            if (!assigned) {
                return ResponseEntity.badRequest().body("Student already assigned or invalid project/student");
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{projectId}/assign-student-by-email")
    public ResponseEntity<?> assignStudentByEmail(
        @PathVariable Long projectId,
        @RequestBody Map<String, String> body,
        Authentication authentication
    ) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Student email is required");
        }

        Project project = projectService.getById(projectId).orElse(null);
        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        }

        User student = userService.getByEmail(email.trim()).orElse(null);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
        if (student.getRole() != Role.STUDENT) {
            return ResponseEntity.badRequest().body("Only students can be assigned to projects");
        }

        boolean assigned = projectService.assignStudent(projectId, student.getId());
        if (!assigned) {
            return ResponseEntity.badRequest().body("Student already assigned or invalid project/student");
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return projectService.delete(id)
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
