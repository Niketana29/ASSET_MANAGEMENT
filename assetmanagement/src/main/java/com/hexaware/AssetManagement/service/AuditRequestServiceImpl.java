package com.hexaware.AssetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.AssetManagement.entities.AuditRequest;
import com.hexaware.AssetManagement.repository.AuditRequestRepository;

@Service
public class AuditRequestServiceImpl implements IAuditRequestService {

	
	@Autowired
	AuditRequestRepository auditRequestRepo;
	
	@Override
	public AuditRequest createAuditRequest(AuditRequest arequest) {
		// TODO Auto-generated method stub
		return auditRequestRepo.save(arequest);
	}

	@Override
	public AuditRequest updateAuditRequest(AuditRequest arequest) {
		// TODO Auto-generated method stub
		return auditRequestRepo.save(arequest);
	}

	@Override
	public AuditRequest getAuditRequestById(int arid) {
		// TODO Auto-generated method stub
		return auditRequestRepo.findById(arid).orElse(null);
	}

	@Override
	public String deleteAuditRequestById(int arid) {
		// TODO Auto-generated method stub
		auditRequestRepo.deleteById(arid);
		return "Audit Request Deleted successfully";
	}

	@Override
	public List<AuditRequest> getAllAuditRequests() {
		// TODO Auto-generated method stub
		return auditRequestRepo.findAll();
	}

}
