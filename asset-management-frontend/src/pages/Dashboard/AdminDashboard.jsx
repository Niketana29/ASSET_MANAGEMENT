import { Link, Outlet } from "react-router-dom";
import "./Dashboard.css";


export default function AdminDashboard() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

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
                    {/* Assets */}
                    <div className="col-md-3 mb-3">
                        <div className="dashboard-card">
                            <h5>Manage Assets</h5>
                            <Link to="assets" className="btn btn-primary mt-2 w-100">
                                Go
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-3 mb-3">
                        <div className="dashboard-card">
                            <h5>Manage Categories</h5>
                            <Link to="categories" className="btn btn-primary mt-2 w-100">
                                Go
                            </Link>
                        </div>
                    </div>

                    {/* Employees */}
                    <div className="col-md-3 mb-3">
                        <div className="dashboard-card">
                            <h5>Manage Employees</h5>
                            <Link to="employees" className="btn btn-primary mt-2 w-100">
                                Go
                            </Link>
                        </div>
                    </div>

                    {/* Requests */}
                    <div className="col-md-3 mb-3">
                        <div className="dashboard-card">
                            <h5>Audit Requests</h5>
                            <Link to="audit" className="btn btn-primary mt-2 w-100">
                                Go
                            </Link>
                            <h5 className="mt-3">Service Requests</h5>
                            <Link to="service-requests" className="btn btn-outline-secondary mt-2 w-100">
                                Go
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Outlet />
        </div>
    ); 

}
