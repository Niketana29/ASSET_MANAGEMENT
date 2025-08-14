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

import com.hexaware.assetManagement.dto.AuditRequestDto;
import com.hexaware.assetManagement.entities.Asset;
import com.hexaware.assetManagement.entities.AuditRequest;
import com.hexaware.assetManagement.entities.Employee;
import com.hexaware.assetManagement.exception.BusinessException;
import com.hexaware.assetManagement.service.IAuditRequestService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/auditrequests")
public class AuditRequestController {
	
	@Autowired
	IAuditRequestService auditRequestService;
	
	@PostMapping("/insert")
    @PreAuthorize("hasAuthority('ADMIN')")
    public AuditRequest createAuditRequest(@Valid @RequestBody AuditRequestDto requestDto) {
		if(requestDto.getArid() != null && requestDto.getArid() >0) {
			throw new BusinessException("arId should not be given for insert operation");
		}
        log.info("POST /insert - Creating Audit Request: {}", requestDto);
		
        return auditRequestService.createAuditRequest(mapDtoToEntity(requestDto));
    }


    @PutMapping("/update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public AuditRequest updateAuditRequest(@Valid @RequestBody AuditRequestDto requestDto) {
    	
        if(requestDto.getArid() == null || requestDto.getArid() <= 0) {
        	throw new BusinessException("Invalid arId");
        }
        log.info("PUT /update - Updating Audit Request: {}", requestDto);
        return auditRequestService.updateAuditRequest(mapDtoToEntity(requestDto));
    }


    @GetMapping("/getbyid/{arid}")
    @PreAuthorize("hasAnyAuthority('ADMIN' , 'USER')")
    public AuditRequest getAuditRequestById(@PathVariable int arid) {
    	log.info("GET /getbyid/{} - Retrieving Audit Request", arid);
        return auditRequestService.getAuditRequestById(arid);
    }


    @DeleteMapping("/deletebyid/{arid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteAuditRequest(@PathVariable int arid) {
        log.warn("DELETE /deletebyid/{} - Deleting Audit Request", arid);
        auditRequestService.deleteAuditRequestById(arid);
        return "Audit request with ID " + arid + " deleted successfully.";
    }


    @GetMapping("/getall")
    @PreAuthorize("hasAnyAuthority('ADMIN' , 'USER')")
    public List<AuditRequest> getAllAuditRequests() {
    	log.info("GET/getall - Fetching all Audit Requests");
        return auditRequestService.getAllAuditRequests();
    }
    
    private AuditRequest mapDtoToEntity(AuditRequestDto dto) {
        AuditRequest ar = new AuditRequest();
        if(dto.getArid() != null && dto.getArid() > 0) {
        	ar.setArid(dto.getArid());
        }

        Employee e = new Employee();
        e.setEid(dto.getEid());
        ar.setEmployee(e);

        Asset a = new Asset();
        a.setAid(dto.getAid());
        ar.setAsset(a);

        ar.setStatus(dto.getStatus());
        return ar;
    }

}
