package com.hexaware.assetManagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class BusinessException extends ResponseStatusException {

	public BusinessException(String reason) {
		super(HttpStatus.BAD_REQUEST, reason);
		// TODO Auto-generated constructor stub
	}
	
	
	

}
