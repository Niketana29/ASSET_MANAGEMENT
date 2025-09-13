import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './pages/Error/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import UserLogin from './pages/Login/UserLogin';
import AdminLogin from './pages/Login/AdminLogin';
import Logout from './pages/Login/Logout';
import DashboardRouter from './pages/Dashboard/DashboardRouter';
import BrowseAssets from './pages/Employee/BrowseAssets';
import AssetDetails from './pages/Employee/AssetDetails';
import MyAllocations from './pages/Employee/MyAllocations';
import RaiseRequest from './pages/Employee/RaiseRequest';
import ServiceRequest from './pages/Employee/ServiceRequest';
import RequestHistory from './pages/Employee/RequestHistory';
import ManageAssets from './pages/Admin/ManageAssets';
import ManageCategories from './pages/Admin/ManageCategories';
import ManageEmployees from './pages/Admin/ManageEmployees';
import AuditRequests from './pages/Admin/AuditRequests';
import ServiceRequests from './pages/Admin/ServiceRequests';
import DashboardHome from './pages/Admin/DashboardHome';
import Reports from './pages/Admin/Reports';
import NotFound from './pages/Error/NotFound';
import NotAuthorized from './pages/Error/NotAuthorized';
import ServerError from './pages/Error/ServerError';

import { ROLES } from './utils/constants';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/logout" element={<Logout />} />

                {/* Protected Routes - All Authenticated Users */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <DashboardRouter />
                  </PrivateRoute>
                } />

                {/* Employee Only Routes */}
                <Route path="/browse-assets" element={
                  <RoleRoute allowedRoles={[ROLES.USER]}>
                    <BrowseAssets />
                  </RoleRoute>
                } />
                
                <Route path="/asset-details/:id" element={
                  <RoleRoute allowedRoles={[ROLES.USER]}>
                    <AssetDetails />
                  </RoleRoute>
                } />
                
                <Route path="/my-allocations" element={
                  <RoleRoute allowedRoles={[ROLES.USER]}>
                    <MyAllocations />
                  </RoleRoute>
                } />
                
                <Route path="/raise-request" element={
                  <RoleRoute allowedRoles={[ROLES.USER]}>
                    <RaiseRequest />
                  </RoleRoute>
                } />
                
                <Route path="/service-request" element={
                  <RoleRoute allowedRoles={[ROLES.USER]}>
                    <ServiceRequest />
                  </RoleRoute>
                } />
                
                <Route path="/request-history" element={
                  <RoleRoute allowedRoles={[ROLES.USER]}>
                    <RequestHistory />
                  </RoleRoute>
                } />

                {/* Admin Only Routes */}
                <Route path="/admin/dashboard" element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <DashboardHome />
                  </RoleRoute>
                } />
                
                <Route path="/admin/assets" element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <ManageAssets />
                  </RoleRoute>
                } />
                
                <Route path="/admin/categories" element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <ManageCategories />
                  </RoleRoute>
                } />
                
                <Route path="/admin/employees" element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <ManageEmployees />
                  </RoleRoute>
                } />
                
                <Route path="/admin/audit-requests" element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <AuditRequests />
                  </RoleRoute>
                } />
                
                <Route path="/admin/service-requests" element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <ServiceRequests />
                  </RoleRoute>
                } />
                
                <Route path="/admin/reports" element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <Reports />
                  </RoleRoute>
                } />

                {/* Error Routes */}
                <Route path="/unauthorized" element={<NotAuthorized />} />
                <Route path="/server-error" element={<ServerError />} />
                <Route path="/404" element={<NotFound />} />
                
                {/* Catch All Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
