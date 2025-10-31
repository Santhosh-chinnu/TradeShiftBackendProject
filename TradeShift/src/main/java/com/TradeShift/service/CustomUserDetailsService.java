package com.TradeShift.service;

import com.TradeShift.entity.User;
import com.TradeShift.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public String registerUser(User user) {
        return "";
    }

    @Override
    public String updateUserDetails(User user) {
        return "";
    }

    @Override
    public void deleteUser(Long id) {

    }

    @Override
    public User getUserById(Long id) {
        return null;
    }

    @Override
    public List<User> getAllUsers() {
        return List.of();
    }

    @Override
    public IUserService loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
        return (IUserService) user;
    }

    public IUserService loadUserByEmail(String email) throws Exception  {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException ("User not found with email: " + email));
        return (IUserService) user;
    }
}
