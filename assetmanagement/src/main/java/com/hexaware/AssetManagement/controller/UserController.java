package com.hexaware.assetManagement.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.assetManagement.dto.AuthRequest;
import com.hexaware.assetManagement.entities.UserInfo;
import com.hexaware.assetManagement.service.JwtService;
import com.hexaware.assetManagement.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	UserService service;

	@Autowired
	JwtService jwtService;

	@Autowired
	AuthenticationManager authenticationManager;
	
    Logger logger = LoggerFactory.getLogger(UserController.class);
    
    @PostMapping("/registration/new")
    public String addNewUser(@RequestBody UserInfo userInfo) {
        return service.addUser(userInfo);
    }

    @PostMapping("/login/authenticate")
    public String authenticateAndGetToken(@RequestBody AuthRequest authRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

        String token;

        if (authentication.isAuthenticated()) {
            token = jwtService.generateToken(authRequest.getUsername());
            logger.info("Token : " + token);
        } else {
            logger.info("Invalid login attempt");
            throw new UsernameNotFoundException("Username or Password is Invalid");
        }

        return token;
    }

}
