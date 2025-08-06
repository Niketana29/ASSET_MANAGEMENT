package com.hexaware.assetManagement.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Servcie_Request")
public class ServiceRequest {
	
	
	@Id
    private int srid;
	
    @ManyToOne
    @JoinColumn(name = "eid")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "aid")
    private Asset asset;
    
    private String description;
    private String issueType; // MALFUNCTION, REPAIR
    private String status;    // PENDING, IN_PROGRESS, COMPLETED
    
	public ServiceRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

    public ServiceRequest(int srid, Employee employee, Asset asset, String description, String issueType, String status) {
        this.srid = srid;
        this.employee = employee;
        this.asset = asset;
        this.description = description;
        this.issueType = issueType;
        this.status = status;
    }
    
    
	public int getSrid() {
		return srid;
	}

	public void setSrid(int srid) {
		this.srid = srid;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getIssueType() {
		return issueType;
	}

	public void setIssueType(String issueType) {
		this.issueType = issueType;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "ServiceRequest [srid=" + srid + ", employee=" + employee + ", asset=" + asset + ", description="
				+ description + ", issueType=" + issueType + ", status=" + status + "]";
	}


    
    
}
