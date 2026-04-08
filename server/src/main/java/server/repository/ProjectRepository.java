package server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import server.model.Project;
import server.model.User;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUsers(User user);
    List<Project> findByUsers_Id(Long userId);
}
