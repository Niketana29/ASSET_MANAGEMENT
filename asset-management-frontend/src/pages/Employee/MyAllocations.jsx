import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AssetAllocationService from "../../services/AssetAllocationService";
import AuthService from "../../services/AuthService";
import "./MyAllocations.css";

export default function MyAllocations() {
  const [allocations, setAllocations] = useState([]);
  const [error, setError] = useState("");
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (!user) return setError("User not logged in");

    AssetAllocationService.getAllocationsByEmployee(user.employeeId)
      .then((res) => {
        setAllocations(res);
      })
      .catch(() => setError("Failed to load allocations"));
  }, [user]);

  if (!user) return <p className="text-center mt-5">{error}</p>;

  return (
    <div className="container allocations-container mt-5">
      <div className="allocations-header">
        <h2>My Allocations</h2>
        <Link to="/dashboard/user/requests/new" className="btn btn-primary">
          Raise New Request
        </Link>
      </div>

      {allocations.length === 0 ? (
        <div className="no-allocations">
          <p>No allocations found.</p>
        </div>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-striped shadow-sm allocations-table">
            <thead>
              <tr>
                <th>Allocation ID</th>
                <th>Asset Name</th>
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
                    <span
                      className={`badge-status ${
                        a.status === "APPROVED"
                          ? "badge-approved"
                          : a.status === "REQUESTED"
                          ? "badge-requested"
                          : "badge-rejected"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>{new Date(a.allocationDate).toLocaleDateString()}</td>
                  <td>{new Date(a.returnDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
