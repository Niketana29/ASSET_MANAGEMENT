import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isActiveRoute = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  if (!isAuthenticated) {
    return (
      <nav className="navbar navbar-expand-lg navbar-gradient shadow-lg">
        <div className="container">
          <Link className="navbar-brand text-white" to="/">
            <strong>Hexaware AM</strong>
          </Link>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-light" to="/login">Login</Link>
            <Link className="btn btn-light" to="/register">Register</Link>
          </div>
        </div>
      </nav>
    );
  }

  const isAdmin = user?.role === ROLES.ADMIN;

  const navItems = isAdmin
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/admin/assets', label: 'Manage Assets', icon: '📦' },
        { path: '/admin/categories', label: 'Categories', icon: '📂' },
        { path: '/admin/employees', label: 'Employees', icon: '👥' },
        { path: '/admin/service-requests', label: 'Service Requests', icon: '🔧' },
        { path: '/admin/audit-requests', label: 'Audit Requests', icon: '📋' },
        { path: '/admin/reports', label: 'Reports', icon: '📊' },
      ]
    : [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/browse-assets', label: 'Browse Assets', icon: '🔍' },
        { path: '/my-allocations', label: 'My Assets', icon: '📦' },
        { path: '/raise-request', label: 'Request Asset', icon: '➕' },
        { path: '/service-request', label: 'Service Request', icon: '🔧' },
        { path: '/request-history', label: 'History', icon: '📚' },
      ];

  return (
    <nav className="navbar navbar-expand-lg navbar-gradient shadow-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand text-white" to="/dashboard">
          <strong>AM</strong> <small>{isAdmin ? 'Admin' : 'Employee'}</small>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMobileMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link nav-link-custom ${isActiveRoute(item.path) ? 'active' : ''}`}
                >
                  <span className="me-1">{item.icon}</span> {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2">
            <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
            <span className="text-white">{user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
