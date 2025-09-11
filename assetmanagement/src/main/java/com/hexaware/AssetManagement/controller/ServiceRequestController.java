package com.hexaware.AssetManagement.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.AssetManagement.dto.ServiceRequestDto;
import com.hexaware.AssetManagement.dto.ServiceRequestResponseDto;
import com.hexaware.AssetManagement.service.IServiceRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/service-requests")
@CrossOrigin(origins = "*")
public class ServiceRequestController {

	@Autowired
	private IServiceRequestService serviceRequestService;

	@PostMapping
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<ServiceRequestResponseDto> createServiceRequest(
			@Valid @RequestBody ServiceRequestDto serviceRequestDto) {
		ServiceRequestResponseDto response = serviceRequestService.createServiceRequest(serviceRequestDto);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/my/{employeeId}")
	@PreAuthorize("hasRole('USER') and @employeeService.getEmployeeById(#employeeId).email == authentication.name")
	public ResponseEntity<List<ServiceRequestResponseDto>> getMyServiceRequests(@PathVariable Long employeeId) {
		List<ServiceRequestResponseDto> requests = serviceRequestService.getEmployeeServiceRequests(employeeId);
		return ResponseEntity.ok(requests);
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<ServiceRequestResponseDto>> getAllServiceRequests() {
		List<ServiceRequestResponseDto> requests = serviceRequestService.getAllServiceRequests();
		return ResponseEntity.ok(requests);
	}

	@GetMapping("/pending")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<ServiceRequestResponseDto>> getPendingServiceRequests() {
		List<ServiceRequestResponseDto> requests = serviceRequestService.getPendingServiceRequests();
		return ResponseEntity.ok(requests);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public ResponseEntity<ServiceRequestResponseDto> getServiceRequestById(@PathVariable Long id) {
		ServiceRequestResponseDto request = serviceRequestService.getServiceRequestById(id);
		return ResponseEntity.ok(request);
	}

	@PutMapping("/{id}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ServiceRequestResponseDto> updateServiceRequestStatus(@PathVariable Long id,
			@RequestBody Map<String, String> request) {
		String status = request.get("status");
		String comments = request.getOrDefault("adminComments", "");
		ServiceRequestResponseDto serviceRequest = serviceRequestService.updateServiceRequestStatus(id, status,
				comments);
		return ResponseEntity.ok(serviceRequest);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteServiceRequest(@PathVariable Long id) {
		serviceRequestService.deleteServiceRequest(id);
		return ResponseEntity.ok().build();
	}
}