import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function Dashboard() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser = localStorage.getItem("user");
        if (storedUser) {

            setUser(JSON.parse(storedUser));
        }
    }, []);

    const roles = (user?.role || "")
        .split(",")
        .map(r => r.trim().toUpperCase())
        .filter(Boolean);

    const isAdmin = roles.includes("ADMIN");
    const isUser = roles.includes("USER");



    return (
        <div className="container mt-5">
            <h2>Dashboard</h2>
            {user ? (
                <>
                    <p>
                        Welcome <strong>{user.username}</strong> (Role:{" "}
                        <strong>{user.role}</strong>)
                    </p>

                    {isAdmin && (
                        <div className="row">
                            <h4 className="mb-3">Admin Section</h4>
                            <div className="col-md-4 mb-3">
                                <div className="card shadow-sm p-3">
                                    <h5>Assets</h5>
                                    <Link to="/assets/manage" className="btn btn-primary mt-2 w-100">
                                        Manage Assets
                                    </Link>
                                    <Link to="/assets/categories" className="btn btn-outline-secondary mt-2 w-100">
                                        Manage Categories
                                    </Link>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card shadow-sm p-3">
                                    <h5>Employees</h5>
                                    <Link to="/employees/manage" className="btn btn-primary mt-2 w-100">
                                        Manage Employees
                                    </Link>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card shadow-sm p-3">
                                    <h5>Requests</h5>
                                    <Link to="/audit/requests" className="btn btn-primary mt-2 w-100">
                                        Audit Requests
                                    </Link>
                                    <Link to="/service/requests" className="btn btn-outline-secondary mt-2 w-100">
                                        Service Requests
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {isUser && (
                        <div className="row mt-4">
                            <h4 className="mb-3">Employee Section</h4>
                            <div className="col-md-4 mb-3">
                                <div className="card shadow-sm p-3">
                                    <h5>Assets</h5>
                                    <Link to="/assets/browse" className="btn btn-primary mt-2 w-100">
                                        Browse Assets
                                    </Link>
                                    <Link to="/assets/my" className="btn btn-outline-secondary mt-2 w-100">
                                        My Allocations
                                    </Link>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card shadow-sm p-3">
                                    <h5>Requests</h5>
                                    <Link to="/assets/request" className="btn btn-primary mt-2 w-100">
                                        Request New Asset
                                    </Link>
                                    <Link to="/service/request" className="btn btn-outline-secondary mt-2 w-100">
                                        Raise Service Request
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (<p>No user info found. Please Log in.</p>)}

        </div>
    );
}