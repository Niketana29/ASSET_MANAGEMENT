import { useEffect, useState } from "react";
import AssetAllocationService from "../../services/AssetAllocationService";
import ServiceRequestService from "../../services/ServiceRequestService";
import AuthService from "../../services/AuthService";
import "./RequestHistory.css";

export default function RequestHistory() {
  const user = AuthService.getCurrentUser();
  const [allocations, setAllocations] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    AssetAllocationService.getAllocationsByEmployee(user.employeeId)
      .then(setAllocations)
      .catch(() => setError("Failed to load allocations"));

    ServiceRequestService.getRequestsByEmployee(user.employeeId)
      .then(setServiceRequests)
      .catch(() => setError("Failed to load service requests"));
  }, [user]);

  if (error) return <p className="alert alert-danger mt-5 text-center">{error}</p>;

  return (
    <div className="container request-history-container mt-5">
      <h2 className="page-title">Request History</h2>

      {/* Asset Allocations */}
      <section className="history-section">
        <h4 className="section-title">Asset Allocation Requests</h4>
        {allocations.length === 0 ? (
          <p className="no-history">No allocation history.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Asset</th>
                  <th>Status</th>
                  <th>Allocation Date</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((a) => (
                  <tr key={a.allocId}>
                    <td>{a.allocId}</td>
                    <td>{a.assetName}</td>
                    <td>
                      {a.status === "APPROVED" && (
                        <span className="badge bg-success">{a.status}</span>
                      )}
                      {a.status === "PENDING" && (
                        <span className="badge bg-warning">REQUESTED</span>
                      )}
                      {a.status === "REJECTED" && (
                        <span className="badge bg-danger">{a.status}</span>
                      )}
                    </td>
                    <td>{new Date(a.allocationDate).toLocaleDateString()}</td>
                    <td>{new Date(a.returnDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Service Requests */}
      <section className="history-section mt-5">
        <h4 className="section-title">Service Requests</h4>
        {serviceRequests.length === 0 ? (
          <p className="no-history">No service request history.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Asset</th>
                  <th>Issue</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map((r) => (
                  <tr key={r.srid}>
                    <td>{r.srid}</td>
                    <td>{r.asset?.aname}</td>
                    <td>{r.issueType}</td>
                    <td>{r.description}</td>
                    <td>
                      {r.status === "PENDING" && (
                        <span className="badge bg-warning">{r.status}</span>
                      )}
                      {r.status === "COMPLETED" && (
                        <span className="badge bg-success">{r.status}</span>
                      )}
                      {r.status === "REJECTED" && (
                        <span className="badge bg-danger">{r.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
