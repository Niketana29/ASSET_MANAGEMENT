import { useEffect, useState } from "react";
import "./RequestHistory.css";
import authService from "../../services/AuthService";
import allocationService from "../../services/allocationService";
import serviceRequestService from "../../services/serviceRequestService";


export default function RequestHistory() {
  const user = authService.getCurrentUser();
  const [allocations, setAllocations] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    allocationService.getAllocationsByEmployee(user.employeeId)
      .then(setAllocations)
      .catch(() => setError("Failed to load allocations"));

    serviceRequestService.getServiceRequestsByEmployee(user.employeeId)
      .then(setServiceRequests)
      .catch(() => setError("Failed to load service requests"));
  }, [user]);

  if (error) return <p className="alert alert-danger mt-5 text-center">{error}</p>;

  return (
    <div className="container request-history-container mt-5">
      <h2 className="page-title">Request History</h2>

      {/* Asset Allocations */}
      <section className="history-section">
        <h4 className="section-title">Asset Allocations</h4>
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
                  <tr key={a.allocationId}>
                    <td>{a.allocationId}</td>
                    <td>{a.asset?.assetName}</td>
                    <td>
                      {a.status === "ACTIVE" && (
                        <span className="badge bg-success">{a.status}</span>
                      )}
                      {a.status === "RETURNED" && (
                        <span className="badge bg-warning">{a.status}</span>
                      )}
                      {a.status === "DAMAGED" && (
                        <span className="badge bg-danger">{a.status}</span>
                      )}
                    </td>
                    <td>{a.allocationDate}</td>
                    <td>{a.returnDate || "-"}</td>
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
                  <tr key={r.requestId}>
                    <td>{r.requestId}</td>
                    <td>{r.asset?.assetName}</td>
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
                      {r.status === "IN_PROGRESS" && (
                        <span className="badge bg-info">{r.status}</span>
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
