package com.TradeShift.service;

import com.TradeShift.entity.User;
import com.TradeShift.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Primary
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public String registerUser(User user) {
        // Add logging to debug
        System.out.println("Received user: " + user);

        try {
            // Check if user already exists with the same email or username
            Optional<User> existingUserByEmail = userRepository.findByEmail(user.getEmail());
            if (existingUserByEmail.isPresent()) {
                return "User with this email already exists: " + user.getEmail();
            }

            Optional<User> existingUserByUsername = userRepository.findByUsername(user.getUsername());
            if (existingUserByUsername.isPresent()) {
                return "Username already taken: " + user.getUsername();
            }

            // Set default role if not provided
            if (user.getRole() == null || user.getRole().trim().isEmpty()) {
                user.setRole("USER");
            }

            Long data = userRepository.save(user).getId();
            return "User Data Registered successfully with ID: " + data;
        } catch (Exception e) {
            System.err.println("Error registering user: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to register user: " + e.getMessage());
        }
    }

    @Override
    public String updateUserDetails(User user) {
        try {
            System.out.println("Updating user with ID: " + user.getId());

            // Check if user exists
            Optional<User> existingUser = userRepository.findById(user.getId());
            if (existingUser.isEmpty()) {
                return "User not found with ID: " + user.getId();
            }

            User userToUpdate = existingUser.get();

            // Update fields only if they are provided (not null)
            if (user.getUsername() != null && !user.getUsername().trim().isEmpty()) {
                // Check if new username is already taken by another user
                Optional<User> userWithSameUsername = userRepository.findByUsername(user.getUsername());
                if (userWithSameUsername.isPresent() && !userWithSameUsername.get().getId().equals(user.getId())) {
                    return "Username already taken: " + user.getUsername();
                }
                userToUpdate.setUsername(user.getUsername());
                System.out.println("Updated username to: " + user.getUsername());
            }

            if (user.getName() != null && !user.getName().trim().isEmpty()) {
                userToUpdate.setName(user.getName());
                System.out.println("Updated name to: " + user.getName());
            }

            if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
                // Check if new email is already taken by another user
                Optional<User> userWithSameEmail = userRepository.findByEmail(user.getEmail());
                if (userWithSameEmail.isPresent() && !userWithSameEmail.get().getId().equals(user.getId())) {
                    return "Email already registered: " + user.getEmail();
                }
                userToUpdate.setEmail(user.getEmail());
                System.out.println("Updated email to: " + user.getEmail());
            }

            if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
                userToUpdate.setPassword(user.getPassword());
                System.out.println("Updated password");
            }

            if (user.getContactNo() != null && !user.getContactNo().trim().isEmpty()) {
                userToUpdate.setContactNo(user.getContactNo());
                System.out.println("Updated contact no to: " + user.getContactNo());
            }

            if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
                userToUpdate.setRole(user.getRole());
                System.out.println("Updated role to: " + user.getRole());
            }

            userRepository.save(userToUpdate);
            return "User details updated successfully for ID: " + user.getId();

        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update user: " + e.getMessage());
        }
    }

    @Override
    public void deleteUser(Long id) {
        try {
            System.out.println("Deleting user with ID: " + id);

            // Check if user exists
            Optional<User> existingUser = userRepository.findById(id);
            if (existingUser.isEmpty()) {
                throw new IllegalArgumentException("User not found with ID: " + id);
            }

            userRepository.deleteById(id);
            System.out.println("User deleted successfully with ID: " + id);

        } catch (IllegalArgumentException e) {
            throw e; // Re-throw the exception for the controller to handle
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete user: " + e.getMessage());
        }
    }

    @Override
    public User getUserById(Long id) {
        try {
            System.out.println("Fetching user with ID: " + id);

            Optional<User> user = userRepository.findById(id);
            if (user.isEmpty()) {
                throw new IllegalArgumentException("User not found with ID: " + id);
            }

            return user.get();

        } catch (IllegalArgumentException e) {
            throw e; // Re-throw the exception for the controller to handle
        } catch (Exception e) {
            System.err.println("Error fetching user: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch user: " + e.getMessage());
        }
    }

    @Override
    public List<User> getAllUsers() {
        try {
            System.out.println("Fetching all users");

            List<User> users = userRepository.findAll();
            System.out.println("Found " + users.size() + " users");

            return users;

        } catch (Exception e) {
            System.err.println("Error fetching all users: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch users: " + e.getMessage());
        }
    }

    @Override
    public IUserService loadUserByUsername(String username) {
        return null;
    }
}