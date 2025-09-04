import api from "./api";

class EmployeeService {
  getAllEmployees() {
    return api.get("/api/employees/getall").then(res => res.data);
  }

  getEmployeeById(eid) {
    return api.get(`/api/employees/getbyid/${eid}`).then(res => res.data);
  }

  addEmployee(employee) {
    return api.post("/api/employees/insert", employee).then(res => res.data);
  }

  updateEmployee(employee) {
    return api.put("/api/employees/update", employee).then(res => res.data);
  }

  deleteEmployee(eid) {
    return api.delete(`/api/employees/deletebyid/${eid}`).then(res => res.data);
  }
}

export default new EmployeeService();
