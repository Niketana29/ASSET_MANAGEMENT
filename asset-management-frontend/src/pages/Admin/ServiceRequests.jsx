import React, { useEffect, useState } from "react";
import ServiceRequestService from "../../services/ServiceRequestService";
import "./ServiceRequests.css";

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "srid", direction: "asc" });
  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    ServiceRequestService.getAllServiceRequests()
      .then((data) => {
        const arrayData = Array.isArray(data) ? data : [];
        setRequests(arrayData);
        setFilteredRequests(arrayData);
      })
      .catch(() => setError("Failed to fetch service requests"));
  };

  const handleStatusChange = (req, newStatus) => {
    const updatedRequest = {
      srid: req.srid,
      eid: req.employee?.eid,
      description: req.description,
      status: newStatus,
    };

    ServiceRequestService.updateServiceRequest(updatedRequest)
      .then(() => loadRequests())
      .catch(() => setError("Failed to update service request"));
  };

  // Search filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = requests.filter(
      (r) =>
        r.employee?.ename.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
    );
    setFilteredRequests(filtered);
  };

  // Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredRequests].sort((a, b) => {
      let valA = key === "employee" ? a.employee?.ename : a[key];
      let valB = key === "employee" ? b.employee?.ename : b[key];

      if (!valA) valA = "";
      if (!valB) valB = "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredRequests(sorted);
  };

  return (
    <div className="service-requests-container container mt-4">
      <h2>Service Requests</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search */}
      <div className="mb-3 d-flex justify-content-end">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by employee or description..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Table Card */}
      <div className="service-table-wrapper shadow-sm">
        <table className="service-table table table-hover table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort("srid")} className="sortable">ID</th>
              <th onClick={() => handleSort("employee")} className="sortable">Employee</th>
              <th onClick={() => handleSort("description")} className="sortable">Description</th>
              <th onClick={() => handleSort("status")} className="sortable">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r) => (
              <tr key={r.srid}>
                <td>{r.srid}</td>
                <td>{r.employee?.ename}</td>
                <td>{r.description}</td>
                <td>
                  {r.status === "PENDING" && <span className="status-badge status-pending">{r.status}</span>}
                  {r.status === "APPROVED" && <span className="status-badge status-approved">{r.status}</span>}
                  {r.status === "REJECTED" && <span className="status-badge status-rejected">{r.status}</span>}
                </td>
                <td className="text-center">
                  {r.status === "PENDING" ? (
                    <div className="service-actions d-flex flex-wrap justify-content-center gap-2">
                      <button
                        className="btn-approve"
                        onClick={() => handleStatusChange(r, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleStatusChange(r, "REJECTED")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="status-badge status-none">No Actions</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No service requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
