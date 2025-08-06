package com.hexaware.assetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.AuditRequest;
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
		return auditRequestRepo.save(arequest);
	}

	@Override
	public AuditRequest updateAuditRequest(AuditRequest arequest) {
		// TODO Auto-generated method stub
        log.info("Service - updateAuditRequest() called with: {}", arequest);
		return auditRequestRepo.save(arequest);
	}

	@Override
	public AuditRequest getAuditRequestById(int arid) {
		// TODO Auto-generated method stub
        log.debug("Service - getAuditRequestById() called with ID: {}", arid);
		return auditRequestRepo.findById(arid).orElse(null);
	}

	@Override
	public String deleteAuditRequestById(int arid) {
		// TODO Auto-generated method stub
        log.warn("Service - deleteAuditRequestById() called with ID: {}", arid);
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
