package com.hexaware.assetmanagement.pojo;

import java.util.Date;

public class AssetAllocation {
	
    private int allocId;
    private int eid;  // Foreign Key: Employee
    private int aid;  // Foreign Key: Asset
    private Date allocationDate;
    private Date returnDate;
    
	public AssetAllocation() {
		super();
		// TODO Auto-generated constructor stub
	}

	public AssetAllocation(int allocId, int eid, int aid, Date allocationDate, Date returnDate) {
		super();
		this.allocId = allocId;
		this.eid = eid;
		this.aid = aid;
		this.allocationDate = allocationDate;
		this.returnDate = returnDate;
	}

	public int getAllocId() {
		return allocId;
	}

	public void setAllocId(int allocId) {
		this.allocId = allocId;
	}

	public int getEid() {
		return eid;
	}

	public void setEid(int eid) {
		this.eid = eid;
	}

	public int getAid() {
		return aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
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
		return "AssetAllocation [allocId=" + allocId + ", eid=" + eid + ", aid=" + aid + ", allocationDate="
				+ allocationDate + ", returnDate=" + returnDate + "]";
	}
    
    
}

