import { Link } from "react-router-dom";
import AuthService from "../services/AuthService";
import "./Navbar.css";


export default function Navbar() {
  const user = AuthService.getCurrentUser();

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
                  <Link className="nav-link" to="/logout">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
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
