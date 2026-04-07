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
