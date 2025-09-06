/*import { useEffect, useState } from "react";
import AssetAllocationService from "../../services/AssetAllocationService";

export default function AllocationApprovals() {
  const [allocations, setAllocations] = useState([]);
  const [error, setError] = useState("");

  const loadAllocations = () => {
    AssetAllocationService.getAllAllocations()
      .then(data => setAllocations(data))
      .catch(() => setError("Failed to load allocations"));
  };

  useEffect(() => loadAllocations(), []);

  const handleApprove = (id) => {
    AssetAllocationService.approveAllocation(id)
      .then(loadAllocations)
      .catch(() => setError("Failed to approve allocation"));
  };

  const handleReject = (id) => {
    AssetAllocationService.rejectAllocation(id)
      .then(loadAllocations)
      .catch(() => setError("Failed to reject allocation"));
  };

  return (
    <div className="container mt-5">
      <h2>Asset Allocation Approvals</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {allocations.length === 0 ? <p>No allocation requests found.</p> :
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th><th>Employee</th><th>Asset</th>
              <th>Allocation Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map(a => (
              <tr key={a.allocId}>
                <td>{a.allocId}</td>
                <td>{a.employee?.empName}</td>
                <td>{a.asset?.aname}</td>
                <td>{a.allocationDate}</td>
                <td>{a.status}</td>
                <td>
                  <button className="btn btn-success btn-sm me-1"
                          onClick={() => handleApprove(a.allocId)}>Approve</button>
                  <button className="btn btn-danger btn-sm"
                          onClick={() => handleReject(a.allocId)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}
*/