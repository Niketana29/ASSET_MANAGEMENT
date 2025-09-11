package com.hexaware.AssetManagement.service;

import java.util.List;

import com.hexaware.AssetManagement.dto.ServiceRequestDto;
import com.hexaware.AssetManagement.dto.ServiceRequestResponseDto;

public interface IServiceRequestService {
	public ServiceRequestResponseDto createServiceRequest(ServiceRequestDto serviceRequestDto);

	public ServiceRequestResponseDto getServiceRequestById(Long requestId);

	public List<ServiceRequestResponseDto> getEmployeeServiceRequests(Long employeeId);

	public List<ServiceRequestResponseDto> getAllServiceRequests();

	public List<ServiceRequestResponseDto> getPendingServiceRequests();

	public ServiceRequestResponseDto updateServiceRequestStatus(Long requestId, String status, String adminComments);

	public void deleteServiceRequest(Long requestId);
}