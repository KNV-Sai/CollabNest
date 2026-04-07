package server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.model.Project;
import server.model.Submission;
import server.model.User;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByProject(Project project);
    List<Submission> findBySubmittedBy(User user);
    List<Submission> findByProjectAndSubmittedBy(Project project, User user);
}
