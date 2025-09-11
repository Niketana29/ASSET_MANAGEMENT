package com.hexaware.AssetManagement.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_requests")
public class AuditRequest {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long auditId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset_id", nullable = false)
	private Asset asset;

	@Column(name = "audit_date")
	private LocalDateTime auditDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AuditStatus status = AuditStatus.PENDING;

	@Column(name = "employee_comments")
	private String employeeComments;

	@Column(name = "admin_comments")
	private String adminComments;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
		if (auditDate == null && status == AuditStatus.VERIFIED) {
			auditDate = LocalDateTime.now();
		}
	}

	public enum AuditStatus {
		PENDING, VERIFIED, REJECTED
	}

	public AuditRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public AuditRequest(Long auditId, Employee employee, Asset asset, LocalDateTime auditDate, AuditStatus status,
			String employeeComments, String adminComments, LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.auditId = auditId;
		this.employee = employee;
		this.asset = asset;
		this.auditDate = auditDate;
		this.status = status;
		this.employeeComments = employeeComments;
		this.adminComments = adminComments;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getAuditId() {
		return auditId;
	}

	public void setAuditId(Long auditId) {
		this.auditId = auditId;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public LocalDateTime getAuditDate() {
		return auditDate;
	}

	public void setAuditDate(LocalDateTime auditDate) {
		this.auditDate = auditDate;
	}

	public AuditStatus getStatus() {
		return status;
	}

	public void setStatus(AuditStatus status) {
		this.status = status;
	}

	public String getEmployeeComments() {
		return employeeComments;
	}

	public void setEmployeeComments(String employeeComments) {
		this.employeeComments = employeeComments;
	}

	public String getAdminComments() {
		return adminComments;
	}

	public void setAdminComments(String adminComments) {
		this.adminComments = adminComments;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	@Override
	public String toString() {
		return "AuditRequest [auditId=" + auditId + ", employee=" + employee + ", asset=" + asset + ", auditDate="
				+ auditDate + ", status=" + status + ", employeeComments=" + employeeComments + ", adminComments="
				+ adminComments + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
	}

}