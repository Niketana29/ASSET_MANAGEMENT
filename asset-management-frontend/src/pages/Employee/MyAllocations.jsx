import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyAllocations.css";
import allocationService from "../../services/allocationService";
import authService from "../../services/AuthService";

export default function MyAllocations() {
  const [allocations, setAllocations] = useState([]);
  const [error, setError] = useState("");
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    allocationService.getMyAllocations(user.employeeId)
      .then((res) => {
        setAllocations(res);
      })
      .catch(() => setError("Failed to load allocations"));
  }, [user]);

  if (!user) return <p className="text-center mt-5">{error}</p>;

  return (
    <div className="container allocations-container mt-5">
      <div className="allocations-header d-flex justify-content-between align-items-center">
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
            <thead className="table-dark">
              <tr>
                <th>Allocation ID</th>
                <th>Asset</th>
                <th>Category</th>
                <th>Serial Number</th>
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
                  <td>{a.asset?.categoryName}</td>
                  <td>{a.asset?.serialNumber}</td>
                  <td>
                    <span
                      className={`badge-status ${
                        a.status === "ACTIVE"
                          ? "badge-approved"
                          : a.status === "RETURNED"
                          ? "badge-requested"
                          : "badge-rejected"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>{a.allocationDate}</td>
                  <td>{a.returnDate || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
