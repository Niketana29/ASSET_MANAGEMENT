package com.hexaware.AssetManagement.service;

import java.util.List;

import com.hexaware.AssetManagement.entities.AuditRequest;

public interface IAuditRequestService {
	
    public AuditRequest createAuditRequest(AuditRequest arequest);
    public AuditRequest updateAuditRequest(AuditRequest arequest);
    
    public AuditRequest getAuditRequestById(int arid);
    public String deleteAuditRequestById(int arid);
    
    public List<AuditRequest> getAllAuditRequests();

}
