package com.hexaware.assetManagement.service;

import java.util.List;

import com.hexaware.assetManagement.entities.ServiceRequest;

public interface IServiceRequestService {
	
    public ServiceRequest createServiceRequest(ServiceRequest srequest);
    public ServiceRequest updateServiceRequest(ServiceRequest srequest);
    
    public ServiceRequest getServiceRequestById(int srid);
    public String deleteServiceRequestById(int srid);
    
    public List<ServiceRequest> getAllServiceRequests();

}
