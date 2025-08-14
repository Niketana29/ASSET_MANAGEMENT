package com.hexaware.assetManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.assetManagement.dto.ServiceRequestDto;
import com.hexaware.assetManagement.entities.Asset;
import com.hexaware.assetManagement.entities.Employee;
import com.hexaware.assetManagement.entities.ServiceRequest;
import com.hexaware.assetManagement.exception.BusinessException;
import com.hexaware.assetManagement.service.IServiceRequestService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/servicerequests")
public class ServiceRequestController {
	
	@Autowired
	IServiceRequestService serviceRequestService;
	
	@PostMapping("/insert")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ServiceRequest createServiceRequest(@Valid @RequestBody ServiceRequestDto srequestDto) {
		if(srequestDto.getSrid() != null && srequestDto.getSrid() >0) {
			throw new BusinessException("srId should not be given for insert operation");
		}
        log.info("POST /insert - Creating new service request: {}", srequestDto);
        return serviceRequestService.createServiceRequest(mapDtoToEntity(srequestDto));
    }


    @PutMapping("/update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ServiceRequest updateServiceRequest(@Valid @RequestBody ServiceRequestDto srequestDto) {
        if(srequestDto.getSrid() == null || srequestDto.getSrid() <= 0) {
        	throw new BusinessException("Invalid srId");
        }
        log.info("PUT /update - Updating service request: {}", srequestDto);
        return serviceRequestService.updateServiceRequest(mapDtoToEntity(srequestDto));
    }


    @GetMapping("/getbyid/{srid}")
    @PreAuthorize("hasAnyAuthority('ADMIN' , 'USER')")
    public ServiceRequest getServiceRequestById(@PathVariable int srid) {
        log.info("GET /getbyid/{} - Fetching service request by ID", srid);
        return serviceRequestService.getServiceRequestById(srid);
    }


    @DeleteMapping("/deletebyid/{srid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteServiceRequest(@PathVariable int srid) {
        log.warn("DELETE /deletebyid/{} - Deleting service request", srid);
        serviceRequestService.deleteServiceRequestById(srid);
        return "Service request with ID " + srid + " deleted successfully.";
    }


    @GetMapping("/getall")
    @PreAuthorize("hasAnyAuthority('ADMIN' , 'USER')")
    public List<ServiceRequest> getAllServiceRequests() {
        log.info("GET /getall - Fetching all service requests");
        return serviceRequestService.getAllServiceRequests();
    }
    
    private ServiceRequest mapDtoToEntity(ServiceRequestDto dto) {
        ServiceRequest sr = new ServiceRequest();
        if(dto.getSrid() != null && dto.getSrid() > 0) {
            sr.setSrid(dto.getSrid());
        }


        Employee e = new Employee();
        e.setEid(dto.getEid());
        sr.setEmployee(e);

        Asset a = new Asset();
        a.setAid(dto.getAid());
        sr.setAsset(a);

        sr.setDescription(dto.getDescription());
        sr.setIssueType(dto.getIssueType());
        sr.setStatus(dto.getStatus());
        return sr;
    }

}
