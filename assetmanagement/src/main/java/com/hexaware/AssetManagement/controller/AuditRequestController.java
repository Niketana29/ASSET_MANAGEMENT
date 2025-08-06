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

@RestController
@RequestMapping("/api/auditrequests")
public class AuditRequestController {
	
	@Autowired
	IAuditRequestService auditRequestService;
	
	@PostMapping("/insert")
    public AuditRequest createAuditRequest(@RequestBody AuditRequest request) {
        return auditRequestService.createAuditRequest(request);
    }


    @PutMapping("/update")
    public AuditRequest updateAuditRequest(@RequestBody AuditRequest request) {
        return auditRequestService.updateAuditRequest(request);
    }


    @GetMapping("/getbyid/{arid}")
    public AuditRequest getAuditRequestById(@PathVariable int arid) {
        return auditRequestService.getAuditRequestById(arid);
    }


    @DeleteMapping("/deletebyid/{arid}")
    public String deleteAuditRequest(@PathVariable int arid) {
        auditRequestService.deleteAuditRequestById(arid);
        return "Audit request with ID " + arid + " deleted successfully.";
    }


    @GetMapping("/getall")
    public List<AuditRequest> getAllAuditRequests() {
        return auditRequestService.getAllAuditRequests();
    }

}
