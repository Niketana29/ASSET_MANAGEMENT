import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          Hexaware Asset Management
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {user ? (
              <>
                {user.roles === "ADMIN" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard/admin">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {user.roles === "USER" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard/user">
                      My Dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="nav-link btn btn-link text-decoration-none"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login/user">
                    User Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login/admin">
                    Admin Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
