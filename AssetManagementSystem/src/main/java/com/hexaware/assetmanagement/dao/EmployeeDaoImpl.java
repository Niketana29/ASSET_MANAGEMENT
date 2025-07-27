package com.hexaware.assetmanagement.dao;

import java.sql.Connection;
import java.util.List;

import com.hexaware.assetmanagement.pojo.Employee;
import com.hexaware.assetmanagement.util.DBUtil;

public class EmployeeDaoImpl implements IEmployeeDao {
	
	Connection con = DBUtil.getDBConnection();
	

	@Override
	public int addEmployee(Employee employee) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public List<Employee> getAllEmployees() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int updateEmployee(Employee employee) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Employee selectById(int eid) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int deleteById(int eid) {
		// TODO Auto-generated method stub
		return 0;
	}

}
