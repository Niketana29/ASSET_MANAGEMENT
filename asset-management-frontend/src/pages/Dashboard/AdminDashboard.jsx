import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { useAuth } from "../../context/AuthContext";
import assetService from "../../services/assetService";
import categoryService from "../../services/categoryService";
import allocationService from "../../services/allocationService";
import serviceRequestService from "../../services/serviceRequestService";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assetsByStatus: [],
    categories: [],
    activeAllocations: 0,
    serviceRequestsByStatus: []
  });

  useEffect(() => {
    if (!user) return;

    // Fetch asset status counts
    assetService.getAssetStatusCount().then((res) =>
      setStats((prev) => ({ ...prev, assetsByStatus: res.data }))
    );

    // Fetch categories with asset count
    categoryService.getCategoriesWithAssetCount().then((res) =>
      setStats((prev) => ({ ...prev, categories: res.data }))
    );

    // Fetch active allocations count
    allocationService.getActiveAllocationCount().then((res) =>
      setStats((prev) => ({ ...prev, activeAllocations: res.data.count }))
    );

    // Fetch service request counts
    serviceRequestService.getRequestStatusCount().then((res) =>
      setStats((prev) => ({ ...prev, serviceRequestsByStatus: res.data }))
    );
  }, [user]);

  if (!user) {
    return <p className="text-center mt-5">No user info found. Please log in.</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <p>
        Welcome <strong>{user.username}</strong> (Role: <strong>{user.roles}</strong>)
      </p>

      <div className="dashboard-section">
        <h4>Quick Stats</h4>
        <ul>
          <li>Active Allocations: {stats.activeAllocations}</li>
          <li>Asset Status Count: {JSON.stringify(stats.assetsByStatus)}</li>
          <li>Service Requests: {JSON.stringify(stats.serviceRequestsByStatus)}</li>
          <li>Categories: {stats.categories.length}</li>
        </ul>
      </div>

      <div className="dashboard-section">
        <h4>Admin Actions</h4>
        <div className="row mt-3">
          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Manage Assets</h5>
              <Link to="/dashboard/admin/assets" className="btn btn-primary mt-2 w-100">Go</Link>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Manage Categories</h5>
              <Link to="/dashboard/admin/categories" className="btn btn-primary mt-2 w-100">Go</Link>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Manage Employees</h5>
              <Link to="/dashboard/admin/employees" className="btn btn-primary mt-2 w-100">Go</Link>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Audit Requests</h5>
              <Link to="/dashboard/admin/audit" className="btn btn-primary mt-2 w-100">Go</Link>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Service Requests</h5>
              <Link to="/dashboard/admin/service-requests" className="btn btn-outline-secondary mt-2 w-100">Go</Link>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="dashboard-card">
              <h5>Reports</h5>
              <Link to="/dashboard/admin/reports" className="btn btn-primary mt-2 w-100">Go</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
