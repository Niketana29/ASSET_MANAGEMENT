import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageEmployees.css";
import employeeService from "../../services/EmployeeService";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    employeeName: "",
    email: "",
    phoneNumber: "",
    location: "",
    department: "",
    designation: "",
    role: "EMPLOYEE",
    isActive: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "employeeId", direction: "asc" });

  useEffect(() => loadEmployees(), []);

  const loadEmployees = () => {
    employeeService.getAllEmployees()
      .then((data) => {
        setEmployees(data);
        setFilteredEmployees(data);
      })
      .catch(() => toast.error("❌ Failed to load employees"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingId) {
      employeeService.updateEmployee(editingId, newEmployee)
        .then(() => {
          toast.success("✅ Employee updated successfully");
          resetForm();
          loadEmployees();
        })
        .catch(() => toast.error("❌ Failed to update employee"));
    } else {
      employeeService.createEmployee(newEmployee)
        .then(() => {
          toast.success("✅ Employee added successfully");
          resetForm();
          loadEmployees();
        })
        .catch(() => toast.error("❌ Failed to add employee"));
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.employeeId);
    setNewEmployee({ ...employee });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      employeeService.deleteEmployee(id)
        .then(() => {
          toast.success("🗑️ Employee deleted successfully");
          loadEmployees();
        })
        .catch(() => toast.error("❌ Failed to delete employee"));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewEmployee({
      employeeName: "",
      email: "",
      phoneNumber: "",
      location: "",
      department: "",
      designation: "",
      role: "EMPLOYEE",
      isActive: true,
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = employees.filter(
      (emp) =>
        emp.employeeName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query)
    );
    setFilteredEmployees(filtered);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...filteredEmployees].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredEmployees(sorted);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Employees</h2>

      <div className="card p-4 shadow-sm mb-4">
        <h5 className="card-title mb-3 text-white bg-primary p-2 rounded">
          {editingId ? "Edit Employee" : "Add New Employee"}
        </h5>

        <form onSubmit={handleAddOrUpdate} className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              name="employeeName"
              placeholder="Name"
              value={newEmployee.employeeName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              name="phoneNumber"
              placeholder="Contact Number"
              value={newEmployee.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              name="location"
              placeholder="Location"
              value={newEmployee.location}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              name="department"
              placeholder="Department"
              value={newEmployee.department}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              name="designation"
              placeholder="Designation"
              value={newEmployee.designation}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <select
              className="form-control"
              name="role"
              value={newEmployee.role}
              onChange={handleChange}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="col-12 d-flex flex-wrap gap-2">
            <button type="submit" className="btn btn-success form-btn">
              {editingId ? "Update Employee" : "Add Employee"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary form-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mb-3 d-flex justify-content-end">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="table-responsive shadow-sm">
        <table className="table table-striped table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort("employeeId")} className="sortable">ID</th>
              <th onClick={() => handleSort("employeeName")} className="sortable">Name</th>
              <th onClick={() => handleSort("email")} className="sortable">Email</th>
              <th onClick={() => handleSort("role")} className="sortable">Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.employeeId}</td>
                <td>{e.employeeName}</td>
                <td>{e.email}</td>
                <td>
                  <span
                    className={`badge ${
                      e.role === "ADMIN"
                        ? "bg-danger"
                        : e.role === "EMPLOYEE"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {e.role}
                  </span>
                </td>
                <td className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-warning btn-sm list-btn" onClick={() => handleEdit(e)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm list-btn" onClick={() => handleDelete(e.employeeId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
