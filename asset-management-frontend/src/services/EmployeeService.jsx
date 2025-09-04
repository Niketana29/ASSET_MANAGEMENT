import api from "./api";

class EmployeeService {

  async getAllEmployees() {
    const res = await api.get("/api/employees/getall");
    return res.data;
  }

  async getEmployeeById(eid) {
    const res = await api.get(`/api/employees/getbyid/${eid}`);
    return res.data;
  }

  async addEmployee(employee) {
    const res = await api.post("/api/employees/insert", {
      ename: employee.ename,
      email: employee.email,
      gender: employee.gender,
      contactNumber: employee.contactNumber,
      address: employee.address,
      role: employee.role
    });
    return res.data;
  }

  async updateEmployee(employee) {
    const res = await api.put("/api/employees/update", {
      eid: employee.eid,
      ename: employee.ename,
      email: employee.email,
      gender: employee.gender,
      contactNumber: employee.contactNumber,
      address: employee.address,
      role: employee.role
    });
    return res.data;
  }

  async deleteEmployee(eid) {
    const res = await api.delete(`/api/employees/deletebyid/${eid}`);
    return res.data;
  }
}

export default new EmployeeService();
