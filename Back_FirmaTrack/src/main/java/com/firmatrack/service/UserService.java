package com.firmatrack.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.firmatrack.repository.UserRepository;
import com.firmatrack.model.user;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<user> getAllUsers() {
        return userRepository.findAll();
    }

    public user getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public user getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public user saveUser(user user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}