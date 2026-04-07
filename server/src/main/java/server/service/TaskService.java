package server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import server.model.Task;
import server.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task create(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public Optional<Task> getById(Long id) {
        return taskRepository.findById(id);
    }

    public Optional<Task> update(Long id, Task updatedTask) {
        return taskRepository.findById(id)
            .map(existing -> {
                existing.setTitle(updatedTask.getTitle());
                existing.setDescription(updatedTask.getDescription());
                existing.setStatus(updatedTask.getStatus());
                existing.setDeadline(updatedTask.getDeadline());
                existing.setProject(updatedTask.getProject());
                existing.setAssignee(updatedTask.getAssignee());
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