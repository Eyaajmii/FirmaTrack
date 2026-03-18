package com.firmatrack.Controller;
import com.firmatrack.model.user;
import com.firmatrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
	    @Autowired
	    private UserService userService;

	    @GetMapping
	    public List<user> getAllUsers() {
	        return userService.getAllUsers();
	    }

	    @PostMapping
	    public user createUser(@RequestBody user user) {
	        return userService.saveUser(user);
	    }

	    @DeleteMapping("/{id}")
	    public void deleteUser(@PathVariable Long id) {
	        userService.deleteUser(id);
	    }
	}