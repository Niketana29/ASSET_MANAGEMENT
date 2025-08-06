package com.hexaware.assetManagement.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Employee")
public class Employee {
	
	
	@Id
    private int eid;
    private String ename;
    private String email;
    private String gender; // FEMALE, MALE
    private String contactNumber;
    private String address;
    private String role; // EMPLOYEE, ADMIN
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<AssetAllocation> allocations;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<ServiceRequest> serviceRequests;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<AuditRequest> auditRequests;
    
	public Employee() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Employee(int eid, String ename, String email, String gender, String contactNumber, String address,
			String role) {
		super();
		this.eid = eid;
		this.ename = ename;
		this.email = email;
		this.gender = gender;
		this.contactNumber = contactNumber;
		this.address = address;
		this.role = role;
	}

	public int getEid() {
		return eid;
	}

	public void setEid(int eid) {
		this.eid = eid;
	}

	public String getEname() {
		return ename;
	}

	public void setEname(String ename) {
		this.ename = ename;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	@Override
	public String toString() {
		return "Employee [eid=" + eid + ", ename=" + ename + ", email=" + email + ", gender=" + gender
				+ ", contactNumber=" + contactNumber + ", address=" + address + ", role=" + role + "]";
	}

}
