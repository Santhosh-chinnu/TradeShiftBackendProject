package com.TradeShift.service;

import com.TradeShift.entity.User;

import java.util.List;

public interface IUserService {
    String registerUser(User user);
    String updateUserDetails(User user);
    void deleteUser(Long id);
    User getUserById(Long id);
    List<User> getAllUsers();
    IUserService loadUserByUsername(String username);
}
