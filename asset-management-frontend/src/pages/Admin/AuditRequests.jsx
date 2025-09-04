import { useEffect, useState } from "react";
import AuditRequestService from "../../services/AuditRequestService";

export default function AuditRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const loadRequests = () => {
    AuditRequestService.getAllAuditRequests()
      .then(res => setRequests(res.data))
      .catch(() => setError("Failed to load audit requests"));
  };

  useEffect(() => loadRequests(), []);

  const handleStatusChange = (id, status) => {
    AuditRequestService.updateAuditRequest(id, { status })
      .then(loadRequests)
      .catch(() => setError("Failed to update status"));
  };

  return (
    <div className="container mt-5">
      <h2>Audit Requests</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {requests.length === 0 ? <p>No audit requests found.</p> :
        <table className="table table-striped">
          <thead>
            <tr><th>ID</th><th>Asset</th><th>Employee</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.arid}>
                <td>{r.arid}</td>
                <td>{r.asset?.aname}</td>
                <td>{r.employee?.empName}</td>
                <td>{r.status}</td>
                <td>
                  {["PENDING","APPROVED","REJECTED"].map(s => (
                    <button key={s} className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleStatusChange(r.arid, s)}>
                      {s}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}
