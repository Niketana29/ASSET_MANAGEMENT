package com.hexaware.AssetManagement.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories")
public class Category {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long categoryId;

	@Column(name = "category_name", nullable = false, unique = true)
	private String categoryName;

	private String description;

	@Column(name = "is_auto_approved", nullable = false)
	private Boolean isAutoApproved = false; // true for simple assets, false for complex

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
	}

	public Category() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Category(Long categoryId, String categoryName, String description, Boolean isAutoApproved,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.categoryId = categoryId;
		this.categoryName = categoryName;
		this.description = description;
		this.isAutoApproved = isAutoApproved;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Boolean getIsAutoApproved() {
		return isAutoApproved;
	}

	public void setIsAutoApproved(Boolean isAutoApproved) {
		this.isAutoApproved = isAutoApproved;
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
		return "Category [categoryId=" + categoryId + ", categoryName=" + categoryName + ", description=" + description
				+ ", isAutoApproved=" + isAutoApproved + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
	}

}