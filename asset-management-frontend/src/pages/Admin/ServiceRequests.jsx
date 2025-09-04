import { useEffect, useState } from "react";
import ServiceRequestService from "../../services/ServiceRequestService";

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const loadRequests = () => {
    ServiceRequestService.getAllServiceRequests()
      .then(res => setRequests(res.data))
      .catch(() => setError("Failed to load service requests"));
  };

  useEffect(() => loadRequests(), []);

  const handleStatusChange = (id, status) => {
    ServiceRequestService.updateServiceRequest(id, { status })
      .then(loadRequests)
      .catch(() => setError("Failed to update status"));
  };

  return (
    <div className="container mt-5">
      <h2>Service Requests</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {requests.length === 0 ? <p>No service requests found.</p> :
        <table className="table table-striped">
          <thead>
            <tr><th>ID</th><th>Asset</th><th>Employee</th><th>Description</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.srid}>
                <td>{r.srid}</td>
                <td>{r.asset?.aname}</td>
                <td>{r.employee?.empName}</td>
                <td>{r.description}</td>
                <td>{r.status}</td>
                <td>
                  {["PENDING","APPROVED","REJECTED"].map(s => (
                    <button key={s} className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleStatusChange(r.srid, s)}>
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
