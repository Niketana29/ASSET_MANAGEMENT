package com.hexaware.assetManagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class ResourceNotFoundException extends ResponseStatusException {

	public ResourceNotFoundException(HttpStatusCode status, String reason) {
		super(HttpStatus.NOT_FOUND, reason);
		// TODO Auto-generated constructor stub
	}
	
	

}
