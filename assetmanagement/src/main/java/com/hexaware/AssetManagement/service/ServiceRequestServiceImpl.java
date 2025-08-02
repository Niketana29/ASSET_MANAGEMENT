package com.hexaware.AssetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.AssetManagement.entities.ServiceRequest;
import com.hexaware.AssetManagement.repository.ServiceRequestRepository;

@Service
public class ServiceRequestServiceImpl implements IServiceRequestService {

	
	@Autowired
	ServiceRequestRepository serviceRequestRepo;
	
	@Override
	public ServiceRequest createServiceRequest(ServiceRequest srequest) {
		// TODO Auto-generated method stub
		return serviceRequestRepo.save(srequest);
	}

	@Override
	public ServiceRequest updateServiceRequest(ServiceRequest srequest) {
		// TODO Auto-generated method stub
		return serviceRequestRepo.save(srequest);
	}

	@Override
	public ServiceRequest getServiceRequestById(int srid) {
		// TODO Auto-generated method stub
		return serviceRequestRepo.findById(srid).orElse(null);
	}

	@Override
	public String deleteServiceRequestById(int srid) {
		// TODO Auto-generated method stub
		serviceRequestRepo.deleteById(srid);
		return "Service Request Deleted successfully";
	}

	@Override
	public List<ServiceRequest> getAllServiceRequests() {
		// TODO Auto-generated method stub
		return serviceRequestRepo.findAll();
	}

}
