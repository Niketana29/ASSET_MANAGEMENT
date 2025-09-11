import React, { useEffect, useState } from "react";
import "./AuditRequests.css";
import auditService from "../../services/auditService";
import allocationService from "../../services/allocationService";

export default function AuditRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "auditId", direction: "asc" });
  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    auditService.getAllAuditRequests()
      .then((data) => {
        const arrayData = Array.isArray(data) ? data : [];
        setRequests(arrayData);
        setFilteredRequests(arrayData);
      })
      .catch(() => setError("Failed to fetch audit requests"));
  };

  // Approve → update status to IN_PROGRESS + allocate asset
  const handleApprove = (req) => {
    auditService.updateAuditStatus(req.auditId, "IN_PROGRESS", "Audit started", "")
      .then(() =>
        allocationService.allocateAsset(req.assetId, req.requestedBy, "Audit approved")
      )
      .then(() => loadRequests())
      .catch(() => setError("Failed to approve and allocate asset"));
  };

  // Reject → update status to CANCELLED
  const handleReject = (req) => {
   auditService.updateAuditStatus(req.auditId, "CANCELLED", "Audit rejected", "")
      .then(() => loadRequests())
      .catch(() => setError("Failed to reject audit request"));
  };

  // Search filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = requests.filter(
      (r) =>
        r.requestedByName?.toLowerCase().includes(query) ||
        r.assetName?.toLowerCase().includes(query)
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
      let valA = a[key] ?? "";
      let valB = b[key] ?? "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredRequests(sorted);
  };

  return (
    <div className="audit-requests-container container mt-4">
      <h2>Audit Requests</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search */}
      <div className="mb-3 d-flex justify-content-end">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by employee or asset..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Table Card */}
      <div className="audit-table-wrapper shadow-sm">
        <table className="audit-table table table-hover table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort("auditId")} className="sortable">ID</th>
              <th onClick={() => handleSort("requestedByName")} className="sortable">Requested By</th>
              <th onClick={() => handleSort("assetName")} className="sortable">Asset</th>
              <th onClick={() => handleSort("status")} className="sortable">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r) => (
              <tr key={r.auditId}>
                <td>{r.auditId}</td>
                <td>{r.requestedByName}</td>
                <td>{r.assetName}</td>
                <td>
                  {r.status === "SCHEDULED" && (
                    <span className="status-badge status-pending">{r.status}</span>
                  )}
                  {r.status === "IN_PROGRESS" && (
                    <span className="status-badge status-verified">{r.status}</span>
                  )}
                  {r.status === "CANCELLED" && (
                    <span className="status-badge status-rejected">{r.status}</span>
                  )}
                  {r.status === "COMPLETED" && (
                    <span className="status-badge status-none">{r.status}</span>
                  )}
                </td>
                <td className="text-center">
                  {r.status === "SCHEDULED" ? (
                    <div className="audit-actions d-flex flex-wrap justify-content-center gap-2">
                      <button className="btn-verify" onClick={() => handleApprove(r)}>
                        Approve & Allocate
                      </button>
                      <button className="btn-reject" onClick={() => handleReject(r)}>
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
                  No audit requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
