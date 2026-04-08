package server.service;

import java.util.List;
import java.util.Optional;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.model.Project;
import server.model.User;
import server.repository.ProjectRepository;
import server.repository.UserRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public Project create(Project project) {
        if (project.getUsers() == null) {
            project.setUsers(new HashSet<>());
        }
        if (project.getTasks() == null) {
            project.setTasks(new HashSet<>());
        }
        return projectRepository.save(project);
    }

    public List<Project> getAll() {
        return projectRepository.findAll();
    }

    public Optional<Project> getById(Long id) {
        return projectRepository.findById(id);
    }

    public List<Project> getProjectsByUser(Long userId) {
        return projectRepository.findByUsers_Id(userId);
    }

    public Optional<Project> update(Long id, Project updatedProject) {
        return projectRepository.findById(id)
            .map(existing -> {
                existing.setName(updatedProject.getName());
                existing.setDescription(updatedProject.getDescription());
                return projectRepository.save(existing);
            });
    }

    public boolean delete(Long id) {
        return projectRepository.findById(id)
            .map(project -> {
                projectRepository.deleteById(id);
                return true;
            })
            .orElse(false);
    }

    public boolean assignStudent(Long projectId, Long studentId) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        Optional<User> studentOpt = userRepository.findById(studentId);

        if (projectOpt.isEmpty() || studentOpt.isEmpty()) {
            return false;
        }

        Project project = projectOpt.get();
        User student = studentOpt.get();

        if (project.getUsers() == null) {
            project.setUsers(new HashSet<>());
        }
        if (student.getProjects() == null) {
            student.setProjects(new HashSet<>());
        }

        boolean alreadyAssigned = project.getUsers().stream()
            .anyMatch(existing -> existing.getId() != null && existing.getId().equals(studentId));
        if (alreadyAssigned) {
            return false;
        }

        // Keep both sides in sync and save owning side (User.projects)
        project.getUsers().add(student);
        student.getProjects().add(project);
        userRepository.save(student);
        projectRepository.save(project);
        return true;
    }
}