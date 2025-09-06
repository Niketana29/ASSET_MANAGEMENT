import { useEffect, useState } from "react";
import EmployeeService from "../../services/EmployeeService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageEmployees.css";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    ename: "",
    email: "",
    gender: "MALE",
    contactNumber: "",
    address: "",
    role: "USER",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "eid", direction: "asc" });

  useEffect(() => loadEmployees(), []);

  const loadEmployees = () => {
    EmployeeService.getAllEmployees()
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

  const handleAdd = (e) => {
    e.preventDefault();
    if (editingId) {
      EmployeeService.updateEmployee({ ...newEmployee, eid: editingId })
        .then(() => {
          toast.success("✅ Employee updated successfully");
          resetForm();
          loadEmployees();
        })
        .catch(() => toast.error("❌ Failed to update employee"));
    } else {
      EmployeeService.addEmployee(newEmployee)
        .then(() => {
          toast.success("✅ Employee added successfully");
          resetForm();
          loadEmployees();
        })
        .catch(() => toast.error("❌ Failed to add employee"));
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.eid);
    setNewEmployee({ ...employee });
  };

  const handleDelete = (eid) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      EmployeeService.deleteEmployee(eid)
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
      ename: "",
      email: "",
      gender: "MALE",
      contactNumber: "",
      address: "",
      role: "USER",
    });
  };

  // Search filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = employees.filter(
      (emp) =>
        emp.ename.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query)
    );
    setFilteredEmployees(filtered);
  };

  // Sort columns
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

      {/* Form Section */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="card-title mb-3 text-white bg-primary p-2 rounded">
          {editingId ? "Edit Employee" : "Add New Employee"}
        </h5>

        <form onSubmit={handleAdd} className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              name="ename"
              placeholder="Name"
              value={newEmployee.ename}
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
              name="contactNumber"
              placeholder="Contact Number"
              value={newEmployee.contactNumber}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              name="address"
              placeholder="Address"
              value={newEmployee.address}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <select
              className="form-control"
              name="gender"
              value={newEmployee.gender}
              onChange={handleChange}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <select
              className="form-control"
              name="role"
              value={newEmployee.role}
              onChange={handleChange}
            >
              <option value="USER">User</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="col-12 d-flex flex-wrap gap-2">
            <button type="submit" className="btn btn-success form-btn">
              {editingId ? "Update Employee" : "Add Employee"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary form-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="mb-3 d-flex justify-content-end">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Employee Table */}
      <div className="table-responsive shadow-sm">
        <table className="table table-striped table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort("eid")} className="sortable">
                ID
              </th>
              <th onClick={() => handleSort("ename")} className="sortable">
                Name
              </th>
              <th onClick={() => handleSort("email")} className="sortable">
                Email
              </th>
              <th onClick={() => handleSort("role")} className="sortable">
                Role
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e.eid}>
                <td>{e.eid}</td>
                <td>{e.ename}</td>
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
                  <button
                    className="btn btn-warning btn-sm list-btn"
                    onClick={() => handleEdit(e)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm list-btn"
                    onClick={() => handleDelete(e.eid)}
                  >
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
