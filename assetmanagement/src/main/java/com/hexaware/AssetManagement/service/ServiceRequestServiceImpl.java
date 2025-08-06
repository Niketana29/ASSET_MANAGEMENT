package com.hexaware.assetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.ServiceRequest;
import com.hexaware.assetManagement.repository.ServiceRequestRepository;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class ServiceRequestServiceImpl implements IServiceRequestService {

	
	@Autowired
	ServiceRequestRepository serviceRequestRepo;
	
	@Override
	public ServiceRequest createServiceRequest(ServiceRequest srequest) {
		// TODO Auto-generated method stub
        log.info("Service - createServiceRequest() called with: {}", srequest);
		return serviceRequestRepo.save(srequest);
	}

	@Override
	public ServiceRequest updateServiceRequest(ServiceRequest srequest) {
		// TODO Auto-generated method stub
        log.info("Service - updateServiceRequest() called with: {}", srequest);
		return serviceRequestRepo.save(srequest);
	}

	@Override
	public ServiceRequest getServiceRequestById(int srid) {
		// TODO Auto-generated method stub
        log.debug("Service - getServiceRequestById() called with ID: {}", srid);
		return serviceRequestRepo.findById(srid).orElse(null);
	}

	@Override
	public String deleteServiceRequestById(int srid) {
		// TODO Auto-generated method stub
        log.warn("Service - deleteServiceRequestById() called with ID: {}", srid);
		serviceRequestRepo.deleteById(srid);
		return "Service Request Deleted successfully";
	}

	@Override
	public List<ServiceRequest> getAllServiceRequests() {
		// TODO Auto-generated method stub
        log.debug("Service - getAllServiceRequests() called");
		return serviceRequestRepo.findAll();
	}

}
