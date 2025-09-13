package com.hexaware.AssetManagement.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.AssetManagement.dto.AssetAllocationResponseDto;
import com.hexaware.AssetManagement.dto.AssetRequestDto;
import com.hexaware.AssetManagement.entities.Asset;
import com.hexaware.AssetManagement.entities.AssetAllocation;
import com.hexaware.AssetManagement.entities.Category;
import com.hexaware.AssetManagement.entities.Employee;
import com.hexaware.AssetManagement.exception.BusinessException;
import com.hexaware.AssetManagement.exception.ResourceNotFoundException;
import com.hexaware.AssetManagement.repository.AssetAllocationRepository;
import com.hexaware.AssetManagement.repository.AssetRepository;
import com.hexaware.AssetManagement.repository.CategoryRepository;
import com.hexaware.AssetManagement.repository.EmployeeRepository;

@Service
@Transactional
public class AssetAllocationServiceImpl implements IAssetAllocationService {

	private static final Logger logger = LoggerFactory.getLogger(AssetAllocationServiceImpl.class);

	@Autowired
	private AssetAllocationRepository allocationRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private AssetRepository assetRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public AssetAllocationResponseDto requestAsset(AssetRequestDto requestDto) {
		logger.info("Processing asset request for employee: {}, asset: {}", requestDto.getEmployeeId(),
				requestDto.getAssetName());

		Employee employee = employeeRepository.findById(requestDto.getEmployeeId())
				.orElseThrow(() -> new ResourceNotFoundException("Employee", "id", requestDto.getEmployeeId()));

		List<Asset> availableAssets = assetRepository
				.findByStatusAndAssetNameContainingIgnoreCase(Asset.AssetStatus.AVAILABLE, requestDto.getAssetName());

		if (availableAssets.isEmpty()) {
			throw new BusinessException("No available assets found with name: " + requestDto.getAssetName());
		}

		Asset asset = availableAssets.get(0);

		List<AssetAllocation> activeAllocations = allocationRepository
				.findActiveAllocationsByAssetId(asset.getAssetId());
		if (!activeAllocations.isEmpty()) {
			throw new BusinessException("Asset is already allocated to another employee");
		}

		AssetAllocation allocation = new AssetAllocation();
		allocation.setEmployee(employee);
		allocation.setAsset(asset);
		allocation.setRequestReason(requestDto.getRequestReason());

		Category category = asset.getCategory();
		if (category.getIsAutoApproved()) {

			allocation.setStatus(AssetAllocation.AllocationStatus.APPROVED);
			allocation.setAllocatedDate(LocalDateTime.now());
			allocation.setAdminComments("Auto-approved for simple asset category");

			asset.setStatus(Asset.AssetStatus.ALLOCATED);
			assetRepository.save(asset);

			logger.info("Asset request auto-approved for employee: {}, asset: {}", employee.getEmployeeId(),
					asset.getAssetName());
		} else {

			allocation.setStatus(AssetAllocation.AllocationStatus.REQUESTED);

			logger.info("Asset request submitted for admin approval - employee: {}, asset: {}",
					employee.getEmployeeId(), asset.getAssetName());
		}

		AssetAllocation savedAllocation = allocationRepository.save(allocation);
		return convertToResponseDto(savedAllocation);
	}

	@Override
	public List<AssetAllocationResponseDto> getEmployeeAllocations(Long employeeId) {
		return allocationRepository.findByEmployeeId(employeeId).stream().map(this::convertToResponseDto)
				.collect(Collectors.toList());
	}

	@Override
	public List<AssetAllocationResponseDto> getAllAllocations() {
		return allocationRepository.findAllWithDetails().stream().map(this::convertToResponseDto)
				.collect(Collectors.toList());
	}

	@Override
	public List<AssetAllocationResponseDto> getPendingAllocations() {
		return allocationRepository.findByStatusWithDetails(AssetAllocation.AllocationStatus.REQUESTED).stream()
				.map(this::convertToResponseDto).collect(Collectors.toList());
	}

	@Override
	public AssetAllocationResponseDto approveAllocation(Long allocationId, String adminComments) {
		logger.info("Approving allocation: {}", allocationId);

		AssetAllocation allocation = allocationRepository.findById(allocationId)
				.orElseThrow(() -> new ResourceNotFoundException("Allocation", "id", allocationId));

		if (allocation.getStatus() != AssetAllocation.AllocationStatus.REQUESTED) {
			throw new BusinessException("Only requested allocations can be approved");
		}

		allocation.setStatus(AssetAllocation.AllocationStatus.APPROVED);
		allocation.setAllocatedDate(LocalDateTime.now());
		allocation.setAdminComments(adminComments);

		Asset asset = allocation.getAsset();
		asset.setStatus(Asset.AssetStatus.ALLOCATED);
		assetRepository.save(asset);

		AssetAllocation savedAllocation = allocationRepository.save(allocation);

		logger.info("Allocation approved successfully: {}", allocationId);
		return convertToResponseDto(savedAllocation);
	}

	@Override
	public AssetAllocationResponseDto rejectAllocation(Long allocationId, String adminComments) {
		logger.info("Rejecting allocation: {}", allocationId);

		AssetAllocation allocation = allocationRepository.findById(allocationId)
				.orElseThrow(() -> new ResourceNotFoundException("Allocation", "id", allocationId));

		if (allocation.getStatus() != AssetAllocation.AllocationStatus.REQUESTED) {
			throw new BusinessException("Only requested allocations can be rejected");
		}

		allocation.setStatus(AssetAllocation.AllocationStatus.REJECTED);
		allocation.setAdminComments(adminComments);

		AssetAllocation savedAllocation = allocationRepository.save(allocation);

		logger.info("Allocation rejected successfully: {}", allocationId);
		return convertToResponseDto(savedAllocation);
	}

	@Override
	public AssetAllocationResponseDto returnAsset(Long allocationId) {
		logger.info("Processing asset return: {}", allocationId);

		AssetAllocation allocation = allocationRepository.findById(allocationId)
				.orElseThrow(() -> new ResourceNotFoundException("Allocation", "id", allocationId));

		if (allocation.getStatus() != AssetAllocation.AllocationStatus.APPROVED) {
			throw new BusinessException("Only approved allocations can be returned");
		}

		allocation.setStatus(AssetAllocation.AllocationStatus.RETURNED);
		allocation.setReturnDate(LocalDateTime.now());

		Asset asset = allocation.getAsset();
		asset.setStatus(Asset.AssetStatus.AVAILABLE);
		assetRepository.save(asset);

		AssetAllocation savedAllocation = allocationRepository.save(allocation);

		logger.info("Asset returned successfully: {}", allocationId);
		return convertToResponseDto(savedAllocation);
	}

	@Override
	public AssetAllocationResponseDto getAllocationById(Long allocationId) {
		AssetAllocation allocation = allocationRepository.findById(allocationId)
				.orElseThrow(() -> new ResourceNotFoundException("Allocation", "id", allocationId));
		return convertToResponseDto(allocation);
	}

	private AssetAllocationResponseDto convertToResponseDto(AssetAllocation allocation) {
		AssetAllocationResponseDto dto = new AssetAllocationResponseDto();
		dto.setAllocationId(allocation.getAllocationId());
		dto.setEmployeeId(allocation.getEmployee().getEmployeeId());
		dto.setEmployeeName(allocation.getEmployee().getEmployeeName());
		dto.setEmployeeEmail(allocation.getEmployee().getEmail());
		dto.setAssetId(allocation.getAsset().getAssetId());
		dto.setAssetNo(allocation.getAsset().getAssetNo());
		dto.setAssetName(allocation.getAsset().getAssetName());
		dto.setCategoryName(allocation.getAsset().getCategory().getCategoryName());
		dto.setAllocatedDate(allocation.getAllocatedDate());
		dto.setReturnDate(allocation.getReturnDate());
		dto.setStatus(allocation.getStatus().toString());
		dto.setRequestReason(allocation.getRequestReason());
		dto.setAdminComments(allocation.getAdminComments());
		dto.setCreatedAt(allocation.getCreatedAt());
		dto.setIsAutoApproved(allocation.getAsset().getCategory().getIsAutoApproved());
		return dto;
	}
}