package com.hexaware.assetManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.assetManagement.entities.AuditRequest;
import com.hexaware.assetManagement.service.IAuditRequestService;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/auditrequests")
public class AuditRequestController {
	
	@Autowired
	IAuditRequestService auditRequestService;
	
	@PostMapping("/insert")
    public AuditRequest createAuditRequest(@RequestBody AuditRequest request) {
        log.info("POST /insert - Creating Audit Request: {}", request);
		
        return auditRequestService.createAuditRequest(request);
    }


    @PutMapping("/update")
    public AuditRequest updateAuditRequest(@RequestBody AuditRequest request) {
        log.info("PUT /update - Updating Audit Request: {}", request);
        return auditRequestService.updateAuditRequest(request);
    }


    @GetMapping("/getbyid/{arid}")
    public AuditRequest getAuditRequestById(@PathVariable int arid) {
    	log.info("GET /getbyid/{} - Retrieving Audit Request", arid);
        return auditRequestService.getAuditRequestById(arid);
    }


    @DeleteMapping("/deletebyid/{arid}")
    public String deleteAuditRequest(@PathVariable int arid) {
        log.warn("DELETE /deletebyid/{} - Deleting Audit Request", arid);
        auditRequestService.deleteAuditRequestById(arid);
        return "Audit request with ID " + arid + " deleted successfully.";
    }


    @GetMapping("/getall")
    public List<AuditRequest> getAllAuditRequests() {
    	log.info("GET/getall - Fetching all Audit Requests");
        return auditRequestService.getAllAuditRequests();
    }

}
