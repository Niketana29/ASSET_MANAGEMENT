import { Link } from "react-router-dom";
import "./Dashboard.css";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center mt-5">No user info found. Please Log in.</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <p>
        Welcome <strong>{user.username}</strong> (Role: <strong>{user.roles}</strong>)
      </p>

      <div className="dashboard-section">
        <h4>Admin Actions</h4>
        <div className="row mt-3">
          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Manage Assets</h5>
              <Link to="/dashboard/admin/assets" className="btn btn-primary mt-2 w-100">
                Go
              </Link>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Manage Categories</h5>
              <Link to="/dashboard/admin/categories" className="btn btn-primary mt-2 w-100">
                Go
              </Link>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Manage Employees</h5>
              <Link to="/dashboard/admin/employees" className="btn btn-primary mt-2 w-100">
                Go
              </Link>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Audit Requests</h5>
              <Link to="/dashboard/admin/audit" className="btn btn-primary mt-2 w-100">
                Go
              </Link>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5 className="mt-3">Service Requests</h5>
              <Link
                to="/dashboard/admin/service-requests"
                className="btn btn-outline-secondary mt-2 w-100"
              >
                Go
              </Link>
            </div>
          </div>

          {/*<div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Allocation Approvals</h5>
              <Link to="/dashboard/admin/allocations" className="btn btn-primary mt-2 w-100">
                Go
              </Link>
            </div>
          </div>*/}

          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Reports</h5>
              <Link to="/dashboard/admin/reports" className="btn btn-primary mt-2 w-100">
                Go
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
