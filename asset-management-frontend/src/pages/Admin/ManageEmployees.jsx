import { useEffect, useState } from "react";
import EmployeeService from "../../services/EmployeeService";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [newEmployee, setNewEmployee] = useState({ empName: "", email: "" });

  const loadEmployees = () => {
    EmployeeService.getAllEmployees()
      .then(res => setEmployees(res.data))
      .catch(() => setError("Failed to load employees"));
  };

  useEffect(() => loadEmployees(), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    EmployeeService.addEmployee(newEmployee)
      .then(() => {
        setNewEmployee({ empName: "", email: "" });
        loadEmployees();
      })
      .catch(() => setError("Failed to add employee"));
  };

  return (
    <div className="container mt-5">
      <h2>Manage Employees</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAdd} className="mb-3 border p-3 shadow-sm">
        <h5>Add New Employee</h5>
        <input type="text" className="form-control mb-2" name="empName" placeholder="Name"
               value={newEmployee.empName} onChange={handleChange} required />
        <input type="email" className="form-control mb-2" name="email" placeholder="Email"
               value={newEmployee.email} onChange={handleChange} required />
        <button className="btn btn-success">Add Employee</button>
      </form>

      <table className="table table-striped">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th></tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.empId}>
              <td>{e.empId}</td>
              <td>{e.empName}</td>
              <td>{e.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
