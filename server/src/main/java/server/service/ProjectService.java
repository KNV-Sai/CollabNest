package server.service;

import java.util.List;
import java.util.Optional;

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
        return projectRepository.save(project);
    }

    public List<Project> getAll() {
        return projectRepository.findAll();
    }

    public Optional<Project> getById(Long id) {
        return projectRepository.findById(id);
    }

    public List<Project> getProjectsByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return projectRepository.findByUsers(user.get());
        }
        return List.of();
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

    public void assignStudent(Long projectId, Long studentId) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        Optional<User> studentOpt = userRepository.findById(studentId);

        if (projectOpt.isPresent() && studentOpt.isPresent()) {
            Project project = projectOpt.get();
            User student = studentOpt.get();

            // Add student to project if not already present
            if (!project.getUsers().contains(student)) {
                project.getUsers().add(student);
                projectRepository.save(project);
            }
        }
    }
}