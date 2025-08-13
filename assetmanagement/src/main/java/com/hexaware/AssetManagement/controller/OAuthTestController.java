package com.hexaware.assetManagement.controller;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OAuthTestController {
	
    @GetMapping("/")
    public String sayHello() {
        return "Hello Friends, Welcome back";
    }

    @GetMapping("/secure")
    public String secureResource() {
        return "This is secured resource, access using app login / GitHub credentials";
    }

    @GetMapping("/oauth2/success")
    public String oauth2Success(OAuth2AuthenticationToken authentication) {
        String githubUsername = authentication.getPrincipal().getAttribute("login");
        return "OAuth2 Login Successful! GitHub username: " + githubUsername;
    }

}
