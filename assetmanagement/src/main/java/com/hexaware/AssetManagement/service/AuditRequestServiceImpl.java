package com.hexaware.assetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.AuditRequest;
import com.hexaware.assetManagement.exception.BusinessException;
import com.hexaware.assetManagement.exception.ResourceNotFoundException;
import com.hexaware.assetManagement.repository.AuditRequestRepository;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class AuditRequestServiceImpl implements IAuditRequestService {

	
	@Autowired
	AuditRequestRepository auditRequestRepo;
	
	@Override
	public AuditRequest createAuditRequest(AuditRequest arequest) {
		// TODO Auto-generated method stub
        log.info("Service - createAuditRequest() called with: {}", arequest);
        if (arequest.getEmployee() == null) {
            throw new BusinessException("Employee is required for an audit request");
        }
        if (arequest.getAsset() == null) {
            throw new BusinessException("Asset is required for an audit request");
        }
        if (arequest.getStatus() == null || arequest.getStatus().trim().isEmpty()) {
            throw new BusinessException("Audit status cannot be empty");
        }
		return auditRequestRepo.save(arequest);
	}

	@Override
	public AuditRequest updateAuditRequest(AuditRequest arequest) {
		// TODO Auto-generated method stub
        log.info("Service - updateAuditRequest() called with: {}", arequest);
        if (!auditRequestRepo.existsById(arequest.getArid())) {
            throw new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Cannot update — AuditRequest not found with ID: " + arequest.getArid());
        }
        
        
		return auditRequestRepo.save(arequest);
	}

	@Override
	public AuditRequest getAuditRequestById(int arid) {
		// TODO Auto-generated method stub
        log.debug("Service - getAuditRequestById() called with ID: {}", arid);
		return auditRequestRepo.findById(arid).orElseThrow(() -> new ResourceNotFoundException(
                HttpStatus.NOT_FOUND,
                "AuditRequest not found with ID: " + arid));
	}

	@Override
	public String deleteAuditRequestById(int arid) {
		// TODO Auto-generated method stub
        log.warn("Service - deleteAuditRequestById() called with ID: {}", arid);
        if (!auditRequestRepo.existsById(arid)) {
            throw new ResourceNotFoundException(HttpStatus.NOT_FOUND,
                    "Cannot delete — AuditRequest not found with ID: " + arid);
        }
		auditRequestRepo.deleteById(arid);
		return "Audit Request Deleted successfully";
	}

	@Override
	public List<AuditRequest> getAllAuditRequests() {
		// TODO Auto-generated method stub
        log.debug("Service - getAllAuditRequests() called");
		return auditRequestRepo.findAll();
	}

}
