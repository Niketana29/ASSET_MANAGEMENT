
import { Link } from "react-router-dom";
import bgImage from "../assets/home-bg.jpg"; 
import "./Home.css";

export default function Home() {
  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >

      <div className="home-content">
        <h1 className="fade-in">Welcome to Hexaware Asset Management</h1>
        <p className="fade-in delay-1">
          Manage company assets, allocations, and service requests seamlessly.
        </p>

        <div className="home-buttons fade-in delay-2">
          <Link to="/register" className="btn btn-success btn-lg px-4">
            Register
          </Link>
          <Link to="/login/admin" className="btn btn-danger btn-lg px-4">
            Admin Login
          </Link>
          <Link to="/login/user" className="btn btn-primary btn-lg px-4">
            User Login
          </Link>
        </div>
      </div>

    </div>
  );
}
