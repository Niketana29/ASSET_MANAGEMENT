import React, { useEffect, useState } from "react";
import AuditRequestService from "../../services/AuditRequestService";
import AssetAllocationService from "../../services/AssetAllocationService";
import "./AuditRequests.css";

export default function AuditRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "arid", direction: "asc" });
  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    AuditRequestService.getAllAuditRequests()
      .then((data) => {
        const arrayData = Array.isArray(data) ? data : [];
        setRequests(arrayData);
        setFilteredRequests(arrayData);
      })
      .catch(() => setError("Failed to fetch audit requests"));
  };

  const handleApprove = (req) => {
    const updatedRequest = {
      arid: req.arid,
      eid: req.employee?.eid,
      aid: req.asset?.aid,
      status: "VERIFIED",
    };

    AuditRequestService.updateAuditRequest(updatedRequest)
      .then(() => {
        const newAllocation = {
          eid: req.employee?.eid,
          aid: req.asset?.aid,
          allocationDate: new Date(),
          returnDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
          status: "ACTIVE",
        };
        return AssetAllocationService.allocateAsset(newAllocation);
      })
      .then(() => loadRequests())
      .catch(() => setError("Failed to approve and allocate asset"));
  };

  const handleReject = (req) => {
    const updatedRequest = {
      arid: req.arid,
      eid: req.employee?.eid,
      aid: req.asset?.aid,
      status: "REJECTED",
    };

    AuditRequestService.updateAuditRequest(updatedRequest)
      .then(() => loadRequests())
      .catch(() => setError("Failed to reject audit request"));
  };

  // Search filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = requests.filter(
      (r) =>
        r.employee?.ename.toLowerCase().includes(query) ||
        r.asset?.aname.toLowerCase().includes(query)
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
      let valA = key === "employee" ? a.employee?.ename : key === "asset" ? a.asset?.aname : a[key];
      let valB = key === "employee" ? b.employee?.ename : key === "asset" ? b.asset?.aname : b[key];

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
              <th onClick={() => handleSort("arid")} className="sortable">ID</th>
              <th onClick={() => handleSort("employee")} className="sortable">Employee</th>
              <th onClick={() => handleSort("asset")} className="sortable">Asset</th>
              <th onClick={() => handleSort("status")} className="sortable">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r) => (
              <tr key={r.arid}>
                <td>{r.arid}</td>
                <td>{r.employee?.ename}</td>
                <td>{r.asset?.aname}</td>
                <td>
                  {r.status === "PENDING" && (
                    <span className="status-badge status-pending">{r.status}</span>
                  )}
                  {r.status === "VERIFIED" && (
                    <span className="status-badge status-verified">{r.status}</span>
                  )}
                  {r.status === "REJECTED" && (
                    <span className="status-badge status-rejected">{r.status}</span>
                  )}
                </td>
                <td className="text-center">
                  {r.status === "PENDING" ? (
                    <div className="audit-actions d-flex flex-wrap justify-content-center gap-2">
                      <button
                        className="btn-verify"
                        onClick={() => handleApprove(r)}
                      >
                        Approve & Allocate
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(r)}
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
