import { useEffect, useState } from "react";
import serviceRequestService from "../../services/serviceRequestService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ServiceRequests.css";

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "requestId",
    direction: "asc",
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    serviceRequestService
      .getAllServiceRequests()
      .then((data) => {
        const arrayData = Array.isArray(data) ? data : [];
        setRequests(arrayData);
        setFilteredRequests(arrayData);
      })
      .catch(() => toast.error("❌ Failed to fetch service requests"));
  };

  const handleStatusChange = (req, newStatus) => {
    serviceRequestService
      .updateRequestStatus(req.requestId, newStatus, "Updated by Admin")
      .then(() => {
        toast.success(`✅ Request ${newStatus}`);
        loadRequests();
      })
      .catch(() => toast.error("❌ Failed to update request status"));
  };

  // Search filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = requests.filter(
      (r) =>
        r.employee?.employeeName.toLowerCase().includes(query) ||
        r.asset?.assetName.toLowerCase().includes(query) ||
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
      let valA, valB;

      if (key === "employee") {
        valA = a.employee?.employeeName;
        valB = b.employee?.employeeName;
      } else if (key === "asset") {
        valA = a.asset?.assetName;
        valB = b.asset?.assetName;
      } else {
        valA = a[key];
        valB = b[key];
      }

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

      {/* Search */}
      <div className="mb-3 d-flex justify-content-end">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by employee, asset or description..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <div className="service-table-wrapper shadow-sm">
        <table className="service-table table table-hover table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort("requestId")} className="sortable">
                ID
              </th>
              <th onClick={() => handleSort("employee")} className="sortable">
                Employee
              </th>
              <th onClick={() => handleSort("asset")} className="sortable">
                Asset
              </th>
              <th>Description</th>
              <th onClick={() => handleSort("status")} className="sortable">
                Status
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r) => (
              <tr key={r.requestId}>
                <td>{r.requestId}</td>
                <td>{r.employee?.employeeName}</td>
                <td>{r.asset?.assetName}</td>
                <td>{r.description}</td>
                <td>
                  <span
                    className={`status-badge ${
                      r.status === "PENDING"
                        ? "status-pending"
                        : r.status === "APPROVED"
                        ? "status-approved"
                        : r.status === "REJECTED"
                        ? "status-rejected"
                        : "status-none"
                    }`}
                  >
                    {r.status}
                  </span>
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
                <td colSpan="6" className="text-center text-muted">
                  No service requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
