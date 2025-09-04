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

    AssetAllocationService.getAllAllocations()
      .then((res) => {
        console.log("Allocations from backend:", res);
        const filtered = res.filter(a => a.employee?.eid === parseInt(user.employeeId));

        console.log("Filtered allocations:", filtered);
        setAllocations(filtered);
      })
      .catch(() => setError("Failed to load allocations"));

  }, [user]);

  if (!user) return <p className="text-center mt-5">{error}</p>;

  return (
    <div className="container allocations-container mt-5">
      <h2>My Allocations</h2>

      {allocations.length === 0 ? (
        <div className="no-allocations">
          <p>No allocations found.</p>
          <Link to="/dashboard/user/requests/new" className="btn btn-primary">Raise New Request</Link>
        </div>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-striped table-hover shadow-sm">
            <thead className="table-dark">
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
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.assetName}</td>
                  <td>
                    {a.status === "AVAILABLE" ? (
                      <span className="badge bg-success">{a.status}</span>
                    ) : (
                      <span className="badge bg-warning">{a.status}</span>
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
    </div>

  );
}
