package com.hexaware.assetManagement.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Audit_Request")
public class AuditRequest {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)

    private int arid;
	
    @ManyToOne
    @JoinColumn(name = "eid")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "aid")
    private Asset asset;
    
    private String status; // PENDING, VERIFIED, REJECTED
    
	public AuditRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

    public AuditRequest(int arid, Employee employee, Asset asset, String status) {
        this.arid = arid;
        this.employee = employee;
        this.asset = asset;
        this.status = status;
    }
    
	public int getArid() {
		return arid;
	}

	public void setArid(int arid) {
		this.arid = arid;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "AuditRequest [arid=" + arid + ", employee=" + employee + ", asset=" + asset + ", status=" + status
				+ "]";
	}


    
    
}
