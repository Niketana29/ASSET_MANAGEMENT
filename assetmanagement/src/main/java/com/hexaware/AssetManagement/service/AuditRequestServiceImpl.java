package com.hexaware.AssetManagement.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.AssetManagement.dto.AuditRequestDto;
import com.hexaware.AssetManagement.entities.Asset;
import com.hexaware.AssetManagement.entities.AssetAllocation;
import com.hexaware.AssetManagement.entities.AuditRequest;
import com.hexaware.AssetManagement.entities.Employee;
import com.hexaware.AssetManagement.exception.BusinessException;
import com.hexaware.AssetManagement.exception.ResourceNotFoundException;
import com.hexaware.AssetManagement.repository.AssetAllocationRepository;
import com.hexaware.AssetManagement.repository.AssetRepository;
import com.hexaware.AssetManagement.repository.AuditRequestRepository;
import com.hexaware.AssetManagement.repository.EmployeeRepository;

@Service
@Transactional
public class AuditRequestServiceImpl implements IAuditRequestService {

	private static final Logger logger = LoggerFactory.getLogger(AuditRequestServiceImpl.class);

	@Autowired
	private AuditRequestRepository auditRequestRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private AssetRepository assetRepository;

	@Autowired
	private AssetAllocationRepository allocationRepository;

	@Override
	public AuditRequestDto createAuditRequest(Long employeeId, Long assetId) {
		logger.info("Creating audit request for employee: {}, asset: {}", employeeId, assetId);

		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));

		Asset asset = assetRepository.findById(assetId)
				.orElseThrow(() -> new ResourceNotFoundException("Asset", "id", assetId));

		List<AuditRequest> existingRequests = auditRequestRepository.findByEmployeeIdAndAssetId(employeeId, assetId);
		if (!existingRequests.isEmpty()
				&& existingRequests.stream().anyMatch(req -> req.getStatus() == AuditRequest.AuditStatus.PENDING)) {
			throw new BusinessException("Audit request already exists for this employee and asset");
		}

		AuditRequest auditRequest = new AuditRequest();
		auditRequest.setEmployee(employee);
		auditRequest.setAsset(asset);
		auditRequest.setStatus(AuditRequest.AuditStatus.PENDING);

		AuditRequest savedRequest = auditRequestRepository.save(auditRequest);

		logger.info("Audit request created successfully with ID: {}", savedRequest.getAuditId());
		return convertToDto(savedRequest);
	}

	@Override
	public List<AuditRequestDto> createAuditRequestsForAllEmployees() {
		logger.info("Creating audit requests for all employees with allocated assets");

		List<AssetAllocation> approvedAllocations = allocationRepository
				.findByStatus(AssetAllocation.AllocationStatus.APPROVED);

		List<AuditRequestDto> createdRequests = new ArrayList<>();

		for (AssetAllocation allocation : approvedAllocations) {
			try {
				List<AuditRequest> existingRequests = auditRequestRepository.findByEmployeeIdAndAssetId(
						allocation.getEmployee().getEmployeeId(), allocation.getAsset().getAssetId());

				boolean hasPendingRequest = existingRequests.stream()
						.anyMatch(req -> req.getStatus() == AuditRequest.AuditStatus.PENDING);

				if (!hasPendingRequest) {
					AuditRequestDto auditRequest = createAuditRequest(allocation.getEmployee().getEmployeeId(),
							allocation.getAsset().getAssetId());
					createdRequests.add(auditRequest);
				}
			} catch (Exception e) {
				logger.error("Failed to create audit request for employee: {}, asset: {}",
						allocation.getEmployee().getEmployeeId(), allocation.getAsset().getAssetId());
			}
		}

		logger.info("Created {} audit requests", createdRequests.size());
		return createdRequests;
	}

	@Override
	public AuditRequestDto getAuditRequestById(Long auditId) {
		AuditRequest auditRequest = auditRequestRepository.findById(auditId)
				.orElseThrow(() -> new ResourceNotFoundException("AuditRequest", "id", auditId));
		return convertToDto(auditRequest);
	}

	@Override
	public List<AuditRequestDto> getEmployeeAuditRequests(Long employeeId) {
		return auditRequestRepository.findByEmployeeId(employeeId).stream().map(this::convertToDto)
				.collect(Collectors.toList());
	}

	@Override
	public List<AuditRequestDto> getAllAuditRequests() {
		return auditRequestRepository.findAllWithDetails().stream().map(this::convertToDto)
				.collect(Collectors.toList());
	}

	@Override
	public List<AuditRequestDto> getPendingAuditRequests() {
		return auditRequestRepository.findByStatusWithDetails(AuditRequest.AuditStatus.PENDING).stream()
				.map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public AuditRequestDto verifyAuditRequest(Long auditId, String employeeComments) {
		logger.info("Verifying audit request: {}", auditId);

		AuditRequest auditRequest = auditRequestRepository.findById(auditId)
				.orElseThrow(() -> new ResourceNotFoundException("AuditRequest", "id", auditId));

		if (auditRequest.getStatus() != AuditRequest.AuditStatus.PENDING) {
			throw new BusinessException("Only pending audit requests can be verified");
		}

		auditRequest.setStatus(AuditRequest.AuditStatus.VERIFIED);
		auditRequest.setEmployeeComments(employeeComments);
		auditRequest.setAuditDate(LocalDateTime.now());

		AuditRequest savedRequest = auditRequestRepository.save(auditRequest);

		logger.info("Audit request verified successfully: {}", auditId);
		return convertToDto(savedRequest);
	}

	@Override
	public AuditRequestDto rejectAuditRequest(Long auditId, String employeeComments) {
		logger.info("Rejecting audit request: {}", auditId);

		AuditRequest auditRequest = auditRequestRepository.findById(auditId)
				.orElseThrow(() -> new ResourceNotFoundException("AuditRequest", "id", auditId));

		if (auditRequest.getStatus() != AuditRequest.AuditStatus.PENDING) {
			throw new BusinessException("Only pending audit requests can be rejected");
		}

		auditRequest.setStatus(AuditRequest.AuditStatus.REJECTED);
		auditRequest.setEmployeeComments(employeeComments);

		AuditRequest savedRequest = auditRequestRepository.save(auditRequest);

		logger.info("Audit request rejected successfully: {}", auditId);
		return convertToDto(savedRequest);
	}

	@Override
	public void deleteAuditRequest(Long auditId) {
		logger.info("Deleting audit request: {}", auditId);

		if (!auditRequestRepository.existsById(auditId)) {
			throw new ResourceNotFoundException("AuditRequest", "id", auditId);
		}

		auditRequestRepository.deleteById(auditId);
		logger.info("Audit request deleted successfully: {}", auditId);
	}

	private AuditRequestDto convertToDto(AuditRequest auditRequest) {
		AuditRequestDto dto = new AuditRequestDto();
		dto.setAuditId(auditRequest.getAuditId());
		dto.setEmployeeId(auditRequest.getEmployee().getEmployeeId());
		dto.setEmployeeName(auditRequest.getEmployee().getEmployeeName());
		dto.setEmployeeEmail(auditRequest.getEmployee().getEmail());
		dto.setAssetId(auditRequest.getAsset().getAssetId());
		dto.setAssetNo(auditRequest.getAsset().getAssetNo());
		dto.setAssetName(auditRequest.getAsset().getAssetName());
		dto.setAuditDate(auditRequest.getAuditDate());
		dto.setStatus(auditRequest.getStatus().toString());
		dto.setEmployeeComments(auditRequest.getEmployeeComments());
		dto.setAdminComments(auditRequest.getAdminComments());
		dto.setCreatedAt(auditRequest.getCreatedAt());
		dto.setUpdatedAt(auditRequest.getUpdatedAt());
		return dto;
	}
}