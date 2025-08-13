package com.hexaware.assetManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hexaware.assetManagement.entities.ServiceRequest;
import com.hexaware.assetManagement.exception.BusinessException;
import com.hexaware.assetManagement.exception.ResourceNotFoundException;
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
        if (srequest.getEmployee() == null) {
            throw new BusinessException("Employee must be specified for service request");
        }
        if (srequest.getAsset() == null) {
            throw new BusinessException("Asset must be specified for service request");
        }
        if (srequest.getIssueType() == null || srequest.getIssueType().trim().isEmpty()) {
            throw new BusinessException("Issue type is required");
        }
		return serviceRequestRepo.save(srequest);
	}

	@Override
	public ServiceRequest updateServiceRequest(ServiceRequest srequest) {
		// TODO Auto-generated method stub
        log.info("Service - updateServiceRequest() called with: {}", srequest);
        if (!serviceRequestRepo.existsById(srequest.getSrid())) {
            throw new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Cannot update — ServiceRequest not found with ID: " + srequest.getSrid());
        }
		return serviceRequestRepo.save(srequest);
	}

	@Override
	public ServiceRequest getServiceRequestById(int srid) {
		// TODO Auto-generated method stub
        log.debug("Service - getServiceRequestById() called with ID: {}", srid);
		return serviceRequestRepo.findById(srid).orElseThrow(() -> new ResourceNotFoundException( HttpStatus.NOT_FOUND, "ServiceRequest not found with ID: " + srid));
	}

	@Override
	public String deleteServiceRequestById(int srid) {
		// TODO Auto-generated method stub
        log.warn("Service - deleteServiceRequestById() called with ID: {}", srid);
        if (!serviceRequestRepo.existsById(srid)) {
            throw new ResourceNotFoundException(HttpStatus.NOT_FOUND, "Cannot delete — ServiceRequest not found with ID: " + srid);
        }
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
