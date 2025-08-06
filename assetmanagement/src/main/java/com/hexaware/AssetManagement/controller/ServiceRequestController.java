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

import com.hexaware.assetManagement.entities.ServiceRequest;
import com.hexaware.assetManagement.service.IServiceRequestService;

@RestController
@RequestMapping("/api/servicerequests")
public class ServiceRequestController {
	
	@Autowired
	IServiceRequestService serviceRequestService;
	
	@PostMapping("/insert")
    public ServiceRequest createServiceRequest(@RequestBody ServiceRequest srequest) {
        return serviceRequestService.createServiceRequest(srequest);
    }


    @PutMapping("/update")
    public ServiceRequest updateServiceRequest(@RequestBody ServiceRequest srequest) {
        return serviceRequestService.updateServiceRequest(srequest);
    }


    @GetMapping("/getbyid/{srid}")
    public ServiceRequest getServiceRequestById(@PathVariable int srid) {
        return serviceRequestService.getServiceRequestById(srid);
    }


    @DeleteMapping("/deletebyid/{srid}")
    public String deleteServiceRequest(@PathVariable int srid) {
        serviceRequestService.deleteServiceRequestById(srid);
        return "Service request with ID " + srid + " deleted successfully.";
    }


    @GetMapping("/getall")
    public List<ServiceRequest> getAllServiceRequests() {
        return serviceRequestService.getAllServiceRequests();
    }

}
