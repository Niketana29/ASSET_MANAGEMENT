import { Link } from "react-router-dom";
import "./Dashboard.css";
import { useAuth } from "../../context/AuthContext";

export default function UserDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center mt-5">No user info found. Please Log in.</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      <p>
        Welcome <strong>{user.username}</strong> (Role:{" "}
        <strong>{user.roles}</strong>)
      </p>

      <div className="dashboard-section">
        <h4>Employee Actions</h4>
        <div className="row mt-3">
          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Browse Assets</h5>
              <Link
                to="/dashboard/user/assets/browse"
                className="btn btn-primary mt-2 w-100"
              >
                Go
              </Link>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>My Allocations</h5>
              <Link
                to="/dashboard/user/allocations"
                className="btn btn-primary mt-2 w-100"
              >
                Go
              </Link>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Request New Asset</h5>
              <Link
                to="/dashboard/user/requests/new"
                className="btn btn-primary mt-2 w-100"
              >
                Go
              </Link>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Raise Service Request</h5>
              <Link
                to="/dashboard/user/requests/service"
                className="btn btn-outline-secondary mt-2 w-100"
              >
                Go
              </Link>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Request History</h5>
              <Link
                to="/dashboard/user/requests/history"
                className="btn btn-outline-dark mt-2 w-100"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
