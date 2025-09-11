import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AM</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Asset Management</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const isAdmin = user?.role === ROLES.ADMIN;
  const isUser = user?.role === ROLES.USER;

  const adminNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/admin/assets', label: 'Manage Assets', icon: '📦' },
    { path: '/admin/categories', label: 'Categories', icon: '📂' },
    { path: '/admin/employees', label: 'Employees', icon: '👥' },
    { path: '/admin/service-requests', label: 'Service Requests', icon: '🔧' },
    { path: '/admin/audit-requests', label: 'Audit Requests', icon: '📋' },
    { path: '/admin/reports', label: 'Reports', icon: '📊' }
  ];

  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/browse-assets', label: 'Browse Assets', icon: '🔍' },
    { path: '/my-allocations', label: 'My Assets', icon: '📦' },
    { path: '/raise-request', label: 'Request Asset', icon: '➕' },
    { path: '/service-request', label: 'Service Request', icon: '🔧' },
    { path: '/request-history', label: 'History', icon: '📚' }
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AM</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Asset Management</h1>
                <p className="text-xs text-gray-500">
                  {isAdmin ? 'Admin Portal' : 'Employee Portal'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  isActiveRoute(item.path) ? 'nav-link-active' : ''
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">
                    {user?.username}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {isAdmin ? 'Administrator' : 'Employee'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>🚪</span>
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-nav-link ${
                    isActiveRoute(item.path) ? 'mobile-nav-link-active' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
