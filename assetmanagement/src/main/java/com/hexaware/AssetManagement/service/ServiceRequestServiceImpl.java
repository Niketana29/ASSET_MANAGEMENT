package com.hexaware.AssetManagement.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.AssetManagement.dto.ServiceRequestDto;
import com.hexaware.AssetManagement.dto.ServiceRequestResponseDto;
import com.hexaware.AssetManagement.entities.Asset;
import com.hexaware.AssetManagement.entities.Employee;
import com.hexaware.AssetManagement.entities.ServiceRequest;
import com.hexaware.AssetManagement.exception.BusinessException;
import com.hexaware.AssetManagement.exception.ResourceNotFoundException;
import com.hexaware.AssetManagement.repository.AssetRepository;
import com.hexaware.AssetManagement.repository.EmployeeRepository;
import com.hexaware.AssetManagement.repository.ServiceRequestRepository;

@Service
@Transactional
public class ServiceRequestServiceImpl implements IServiceRequestService {

	private static final Logger logger = LoggerFactory.getLogger(ServiceRequestServiceImpl.class);

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private AssetRepository assetRepository;

	@Override
	public ServiceRequestResponseDto createServiceRequest(ServiceRequestDto serviceRequestDto) {
		logger.info("Creating service request for asset: {}", serviceRequestDto.getAssetNo());

		Employee employee = employeeRepository.findById(serviceRequestDto.getEmployeeId())
				.orElseThrow(() -> new ResourceNotFoundException("Employee", "id", serviceRequestDto.getEmployeeId()));

		Asset asset = assetRepository.findById(serviceRequestDto.getAssetId())
				.orElseThrow(() -> new ResourceNotFoundException("Asset", "id", serviceRequestDto.getAssetId()));

		if (!asset.getAssetNo().equals(serviceRequestDto.getAssetNo())) {
			throw new BusinessException("Asset number does not match with asset ID");
		}

		ServiceRequest serviceRequest = new ServiceRequest();
		serviceRequest.setEmployee(employee);
		serviceRequest.setAsset(asset);
		serviceRequest.setAssetNo(serviceRequestDto.getAssetNo());
		serviceRequest.setDescription(serviceRequestDto.getDescription());
		serviceRequest.setIssueType(ServiceRequest.IssueType.valueOf(serviceRequestDto.getIssueType()));
		serviceRequest.setStatus(ServiceRequest.ServiceStatus.PENDING);

		ServiceRequest savedRequest = serviceRequestRepository.save(serviceRequest);

		logger.info("Service request created successfully with ID: {}", savedRequest.getRequestId());
		return convertToResponseDto(savedRequest);
	}

	@Override
	public ServiceRequestResponseDto getServiceRequestById(Long requestId) {
		ServiceRequest serviceRequest = serviceRequestRepository.findById(requestId)
				.orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "id", requestId));
		return convertToResponseDto(serviceRequest);
	}

	@Override
	public List<ServiceRequestResponseDto> getEmployeeServiceRequests(Long employeeId) {
		return serviceRequestRepository.findByEmployeeId(employeeId).stream().map(this::convertToResponseDto)
				.collect(Collectors.toList());
	}

	@Override
	public List<ServiceRequestResponseDto> getAllServiceRequests() {
		return serviceRequestRepository.findAllWithDetails().stream().map(this::convertToResponseDto)
				.collect(Collectors.toList());
	}

	@Override
	public List<ServiceRequestResponseDto> getPendingServiceRequests() {
		return serviceRequestRepository.findByStatusWithDetails(ServiceRequest.ServiceStatus.PENDING).stream()
				.map(this::convertToResponseDto).collect(Collectors.toList());
	}

	@Override
	public ServiceRequestResponseDto updateServiceRequestStatus(Long requestId, String status, String adminComments) {
		logger.info("Updating service request status: {}", requestId);

		ServiceRequest serviceRequest = serviceRequestRepository.findById(requestId)
				.orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "id", requestId));

		try {
			ServiceRequest.ServiceStatus newStatus = ServiceRequest.ServiceStatus.valueOf(status);
			serviceRequest.setStatus(newStatus);
			serviceRequest.setAdminComments(adminComments);

			if (newStatus == ServiceRequest.ServiceStatus.COMPLETED) {
				Asset asset = serviceRequest.getAsset();
				if (asset.getStatus() == Asset.AssetStatus.MAINTENANCE) {
					asset.setStatus(Asset.AssetStatus.AVAILABLE);
					assetRepository.save(asset);
				}
			} else if (newStatus == ServiceRequest.ServiceStatus.IN_PROGRESS) {
				Asset asset = serviceRequest.getAsset();
				asset.setStatus(Asset.AssetStatus.MAINTENANCE);
				assetRepository.save(asset);
			}

			ServiceRequest updatedRequest = serviceRequestRepository.save(serviceRequest);

			logger.info("Service request status updated successfully: {}", requestId);
			return convertToResponseDto(updatedRequest);

		} catch (IllegalArgumentException e) {
			throw new BusinessException("Invalid status: " + status);
		}
	}

	@Override
	public void deleteServiceRequest(Long requestId) {
		logger.info("Deleting service request: {}", requestId);

		if (!serviceRequestRepository.existsById(requestId)) {
			throw new ResourceNotFoundException("ServiceRequest", "id", requestId);
		}

		serviceRequestRepository.deleteById(requestId);
		logger.info("Service request deleted successfully: {}", requestId);
	}

	private ServiceRequestResponseDto convertToResponseDto(ServiceRequest serviceRequest) {
		ServiceRequestResponseDto dto = new ServiceRequestResponseDto();
		dto.setRequestId(serviceRequest.getRequestId());
		dto.setEmployeeId(serviceRequest.getEmployee().getEmployeeId());
		dto.setEmployeeName(serviceRequest.getEmployee().getEmployeeName());
		dto.setEmployeeEmail(serviceRequest.getEmployee().getEmail());
		dto.setAssetId(serviceRequest.getAsset().getAssetId());
		dto.setAssetNo(serviceRequest.getAssetNo());
		dto.setAssetName(serviceRequest.getAsset().getAssetName());
		dto.setDescription(serviceRequest.getDescription());
		dto.setIssueType(serviceRequest.getIssueType().toString());
		dto.setStatus(serviceRequest.getStatus().toString());
		dto.setAdminComments(serviceRequest.getAdminComments());
		dto.setCreatedAt(serviceRequest.getCreatedAt());
		dto.setUpdatedAt(serviceRequest.getUpdatedAt());
		return dto;
	}
}