package server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.model.Project;
import server.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
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
}