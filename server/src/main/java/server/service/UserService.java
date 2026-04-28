package server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import server.model.Role;
import server.model.User;
import server.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ CREATE USER (SIGNUP)
    public User create(User user) {

        // 🔴 Check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        // ❗ Ensure password is provided
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new RuntimeException("Password cannot be null or empty");
        }

        // 🔐 Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // ✅ Default role (never trust frontend)
        if (user.getRole() == null) {
            user.setRole(Role.STUDENT);
        }

        return userRepository.save(user);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ✅ SAFE UPDATE
    public Optional<User> update(Long id, User updatedUser) {
        return userRepository.findById(id)
            .map(existing -> {

                if (updatedUser.getName() != null) {
                    existing.setName(updatedUser.getName());
                }

                if (updatedUser.getEmail() != null) {
                    existing.setEmail(updatedUser.getEmail());
                }

                // 🔐 Encode password only if provided
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
                    existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                // ❌ Do NOT allow role updates from frontend
                // existing.setRole(updatedUser.getRole());

                return userRepository.save(existing);
            });
    }

    public boolean delete(Long id) {
        return userRepository.findById(id)
            .map(user -> {
                userRepository.deleteById(id);
                return true;
            })
            .orElse(false);
    }
}