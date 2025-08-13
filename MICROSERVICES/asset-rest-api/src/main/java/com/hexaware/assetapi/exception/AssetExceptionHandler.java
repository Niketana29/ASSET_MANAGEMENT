package com.hexaware.assetapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AssetExceptionHandler {
	
    @ExceptionHandler({Exception.class})
    public ResponseEntity<String> handleAnyExp(Exception e) {
        return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
    }

}
