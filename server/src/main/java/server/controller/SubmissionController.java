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

import server.model.Role;
import server.model.Submission;
import server.model.SubmissionStatus;
import server.model.User;
import server.service.SubmissionService;
import server.service.UserService;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final UserService userService;

    public SubmissionController(SubmissionService submissionService, UserService userService) {
        this.submissionService = submissionService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Submission> create(@RequestBody Submission submission) {
        Submission created = submissionService.create(submission);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/my")
    public ResponseEntity<?> createMySubmission(@RequestBody Map<String, String> body, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        User student = userService.getByEmail(authentication.getName()).orElse(null);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        if (student.getRole() != Role.STUDENT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only students can submit project work");
        }

        String projectIdRaw = body.get("projectId");
        if (projectIdRaw == null || projectIdRaw.isBlank()) {
            return ResponseEntity.badRequest().body("Project is required");
        }

        Long projectId;
        try {
            projectId = Long.parseLong(projectIdRaw);
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().body("Invalid project id");
        }

        String title = body.getOrDefault("title", "Project Submission");
        String description = body.get("description");
        String submissionUrl = body.get("submissionUrl");

        return submissionService.createForStudent(student.getId(), projectId, title, description, submissionUrl)
            .<ResponseEntity<?>>map(created -> ResponseEntity.status(HttpStatus.CREATED).body(created))
            .orElse(ResponseEntity.badRequest().body("Project not found or student is not assigned to this project"));
    }

    @GetMapping
    public ResponseEntity<List<Submission>> getAll(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(submissionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Submission> getById(@PathVariable Long id) {
        return submissionService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Submission>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(submissionService.getByProject(projectId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Submission>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(submissionService.getByUser(userId));
    }

    @GetMapping("/user/me")
    public ResponseEntity<List<Submission>> getByCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return userService.getByEmail(authentication.getName())
            .map(user -> ResponseEntity.ok(submissionService.getByUser(user.getId())))
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Submission> update(@PathVariable Long id, @RequestBody Submission submission, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return submissionService.update(id, submission)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<?> reviewSubmission(
        @PathVariable Long id,
        @RequestBody Map<String, Object> body,
        Authentication authentication
    ) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only teachers can review submissions");
        }

        User reviewer = userService.getByEmail(authentication.getName()).orElse(null);
        if (reviewer == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Reviewer not found");
        }

        SubmissionStatus status = null;
        if (body.get("status") != null) {
            try {
                status = SubmissionStatus.valueOf(body.get("status").toString());
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body("Invalid submission status");
            }
        }

        String feedback = body.get("feedback") != null ? body.get("feedback").toString() : null;
        Double grade = null;
        if (body.get("grade") != null && !body.get("grade").toString().isBlank()) {
            try {
                grade = Double.parseDouble(body.get("grade").toString());
            } catch (NumberFormatException ex) {
                return ResponseEntity.badRequest().body("Invalid grade");
            }
        }

        return submissionService.reviewSubmission(id, reviewer, status, feedback, grade)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Submission not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return submissionService.delete(id)
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
