package server.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.model.Project;
import server.model.Submission;
import server.model.SubmissionStatus;
import server.model.User;
import server.repository.ProjectRepository;
import server.repository.SubmissionRepository;
import server.repository.UserRepository;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Autowired
    public SubmissionService(SubmissionRepository submissionRepository,
                           ProjectRepository projectRepository,
                           UserRepository userRepository) {
        this.submissionRepository = submissionRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public Submission create(Submission submission) {
        if (submission.getSubmittedAt() == null) {
            submission.setSubmittedAt(LocalDateTime.now());
        }
        if (submission.getStatus() == null) {
            submission.setStatus(SubmissionStatus.SUBMITTED);
        }
        return submissionRepository.save(submission);
    }

    public Optional<Submission> createForStudent(Long studentId, Long projectId, String title, String description, String submissionUrl) {
        Optional<User> userOpt = userRepository.findById(studentId);
        Optional<Project> projectOpt = projectRepository.findById(projectId);

        if (userOpt.isEmpty() || projectOpt.isEmpty()) {
            return Optional.empty();
        }

        User student = userOpt.get();
        Project project = projectOpt.get();

        // Student must be assigned to the project before submitting work
        if (project.getUsers() == null || !project.getUsers().contains(student)) {
            return Optional.empty();
        }

        Submission submission = Submission.builder()
            .project(project)
            .submittedBy(student)
            .title(title)
            .description(description)
            .submissionUrl(submissionUrl)
            .status(SubmissionStatus.SUBMITTED)
            .submittedAt(LocalDateTime.now())
            .build();

        return Optional.of(submissionRepository.save(submission));
    }

    public Optional<Submission> reviewSubmission(Long submissionId, User reviewer, SubmissionStatus status, String feedback, Double grade) {
        return submissionRepository.findById(submissionId)
            .map(existing -> {
                if (status != null) {
                    existing.setStatus(status);
                }
                if (feedback != null) {
                    existing.setFeedback(feedback);
                }
                if (grade != null) {
                    existing.setGrade(grade);
                }
                existing.setReviewedBy(reviewer);
                existing.setReviewedAt(LocalDateTime.now());
                return submissionRepository.save(existing);
            });
    }

    public List<Submission> getAll() {
        return submissionRepository.findAll();
    }

    public Optional<Submission> getById(Long id) {
        return submissionRepository.findById(id);
    }

    public List<Submission> getByProject(Long projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isPresent()) {
            return submissionRepository.findByProject(project.get());
        }
        return List.of();
    }

    public List<Submission> getByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return submissionRepository.findBySubmittedBy(user.get());
        }
        return List.of();
    }

    public Optional<Submission> update(Long id, Submission updatedSubmission) {
        return submissionRepository.findById(id)
            .map(existing -> {
                if (updatedSubmission.getTitle() != null) {
                    existing.setTitle(updatedSubmission.getTitle());
                }
                if (updatedSubmission.getDescription() != null) {
                    existing.setDescription(updatedSubmission.getDescription());
                }
                if (updatedSubmission.getSubmissionUrl() != null) {
                    existing.setSubmissionUrl(updatedSubmission.getSubmissionUrl());
                }
                if (updatedSubmission.getStatus() != null) {
                    existing.setStatus(updatedSubmission.getStatus());
                }
                if (updatedSubmission.getFeedback() != null) {
                    existing.setFeedback(updatedSubmission.getFeedback());
                    existing.setReviewedAt(LocalDateTime.now());
                }
                if (updatedSubmission.getGrade() != null) {
                    existing.setGrade(updatedSubmission.getGrade());
                }
                if (updatedSubmission.getReviewedBy() != null) {
                    existing.setReviewedBy(updatedSubmission.getReviewedBy());
                }
                return submissionRepository.save(existing);
            });
    }

    public boolean delete(Long id) {
        return submissionRepository.findById(id)
            .map(submission -> {
                submissionRepository.deleteById(id);
                return true;
            })
            .orElse(false);
    }
}
