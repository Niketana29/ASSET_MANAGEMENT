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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.AssetManagement.dto.AuditRequestDto;
import com.hexaware.AssetManagement.service.IAuditRequestService;

@RestController
@RequestMapping("/api/audit-requests")
@CrossOrigin(origins = "*")
public class AuditRequestController {

	@Autowired
	private IAuditRequestService auditRequestService;

	@PostMapping("/create-all")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<AuditRequestDto>> createAuditRequestsForAll() {
		List<AuditRequestDto> requests = auditRequestService.createAuditRequestsForAllEmployees();
		return ResponseEntity.ok(requests);
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<AuditRequestDto> createAuditRequest(@RequestParam Long employeeId,
			@RequestParam Long assetId) {
		AuditRequestDto request = auditRequestService.createAuditRequest(employeeId, assetId);
		return ResponseEntity.ok(request);
	}

	@GetMapping("/my/{employeeId}")
	@PreAuthorize("hasRole('USER') and @employeeService.getEmployeeById(#employeeId).email == authentication.name")
	public ResponseEntity<List<AuditRequestDto>> getMyAuditRequests(@PathVariable Long employeeId) {
		List<AuditRequestDto> requests = auditRequestService.getEmployeeAuditRequests(employeeId);
		return ResponseEntity.ok(requests);
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<AuditRequestDto>> getAllAuditRequests() {
		List<AuditRequestDto> requests = auditRequestService.getAllAuditRequests();
		return ResponseEntity.ok(requests);
	}

	@GetMapping("/pending")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<AuditRequestDto>> getPendingAuditRequests() {
		List<AuditRequestDto> requests = auditRequestService.getPendingAuditRequests();
		return ResponseEntity.ok(requests);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public ResponseEntity<AuditRequestDto> getAuditRequestById(@PathVariable Long id) {
		AuditRequestDto request = auditRequestService.getAuditRequestById(id);
		return ResponseEntity.ok(request);
	}

	@PutMapping("/{id}/verify")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<AuditRequestDto> verifyAuditRequest(@PathVariable Long id,
			@RequestBody Map<String, String> request) {
		String comments = request.getOrDefault("employeeComments", "");
		AuditRequestDto auditRequest = auditRequestService.verifyAuditRequest(id, comments);
		return ResponseEntity.ok(auditRequest);
	}

	@PutMapping("/{id}/reject")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<AuditRequestDto> rejectAuditRequest(@PathVariable Long id,
			@RequestBody Map<String, String> request) {
		String comments = request.getOrDefault("employeeComments", "");
		AuditRequestDto auditRequest = auditRequestService.rejectAuditRequest(id, comments);
		return ResponseEntity.ok(auditRequest);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteAuditRequest(@PathVariable Long id) {
		auditRequestService.deleteAuditRequest(id);
		return ResponseEntity.ok().build();
	}
}