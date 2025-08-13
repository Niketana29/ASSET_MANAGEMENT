package com.hexaware.assetapi.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class AssetNotFoundException extends ResponseStatusException {
    public AssetNotFoundException(HttpStatusCode status, String msg) {
        super(status, msg);
    }

}
