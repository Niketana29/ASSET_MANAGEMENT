package com.hexaware.assetManagement.service;

import java.util.List;

import com.hexaware.assetManagement.entities.AuditRequest;

public interface IAuditRequestService {
	
    public AuditRequest createAuditRequest(AuditRequest arequest);
    public AuditRequest updateAuditRequest(AuditRequest arequest);
    
    public AuditRequest getAuditRequestById(int arid);
    public String deleteAuditRequestById(int arid);
    
    public List<AuditRequest> getAllAuditRequests();

}
