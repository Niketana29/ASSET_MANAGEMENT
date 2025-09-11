import api from './api';

class EmployeeService {
  async getAllEmployees() {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employees' };
    }
  }

  async getEmployeeById(id) {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employee details' };
    }
  }

  async createEmployee(employeeData) {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create employee' };
    }
  }

  async updateEmployee(id, employeeData) {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update employee' };
    }
  }

  async deleteEmployee(id) {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete employee' };
    }
  }
}

export default new EmployeeService();
