package server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.model.Project;
import server.model.Task;
import server.model.TaskStatus;
import server.model.User;
import server.repository.ProjectRepository;
import server.repository.TaskRepository;
import server.repository.UserRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    public Task create(Task task) {
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.TODO);
        }
        return taskRepository.save(task);
    }

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public Optional<Task> getById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getTasksByAssignee(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return taskRepository.findByAssignee(user.get());
        }
        return List.of();
    }

    public List<Task> getTasksByProject(Long projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isPresent()) {
            return taskRepository.findByProject(project.get());
        }
        return List.of();
    }

    public Optional<Task> update(Long id, Task updatedTask) {
        return taskRepository.findById(id)
            .map(existing -> {
                if (updatedTask.getName() != null) {
                    existing.setName(updatedTask.getName());
                }
                if (updatedTask.getDescription() != null) {
                    existing.setDescription(updatedTask.getDescription());
                }
                if (updatedTask.getStatus() != null) {
                    existing.setStatus(updatedTask.getStatus());
                }
                if (updatedTask.getDueDate() != null) {
                    existing.setDueDate(updatedTask.getDueDate());
                }
                if (updatedTask.getProject() != null) {
                    existing.setProject(updatedTask.getProject());
                }
                if (updatedTask.getAssignee() != null) {
                    existing.setAssignee(updatedTask.getAssignee());
                }
                return taskRepository.save(existing);
            });
    }

    public boolean delete(Long id) {
        return taskRepository.findById(id)
            .map(task -> {
                taskRepository.deleteById(id);
                return true;
            })
            .orElse(false);
    }
}