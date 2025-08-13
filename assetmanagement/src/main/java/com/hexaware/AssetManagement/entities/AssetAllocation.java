package com.hexaware.assetManagement.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "Asset_Allocation")
public class AssetAllocation {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)

    private int allocId;
	
	
    @ManyToOne
    @JoinColumn(name = "eid")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "aid")
    private Asset asset;

    private Date allocationDate;
    private Date returnDate;
    
	public AssetAllocation() {
		super();
		// TODO Auto-generated constructor stub
	}

    public AssetAllocation(int allocId, Employee employee, Asset asset, Date allocationDate, Date returnDate) {
        this.allocId = allocId;
        this.employee = employee;
        this.asset = asset;
        this.allocationDate = allocationDate;
        this.returnDate = returnDate;
    }

	public int getAllocId() {
		return allocId;
	}

	public void setAllocId(int allocId) {
		this.allocId = allocId;
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

	public Date getAllocationDate() {
		return allocationDate;
	}

	public void setAllocationDate(Date allocationDate) {
		this.allocationDate = allocationDate;
	}

	public Date getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(Date returnDate) {
		this.returnDate = returnDate;
	}

	@Override
	public String toString() {
		return "AssetAllocation [allocId=" + allocId + ", employee=" + employee + ", asset=" + asset
				+ ", allocationDate=" + allocationDate + ", returnDate=" + returnDate + "]";
	}

	
	
	
    
}

