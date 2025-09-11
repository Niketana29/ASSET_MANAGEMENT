import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";

// Public Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import AdminLogin from "./pages/Login/AdminLogin";
import UserLogin from "./pages/Login/UserLogin";
import Logout from "./pages/Login/Logout";

// Admin Pages
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ManageAssets from "./pages/Admin/ManageAssets";
import ManageCategories from "./pages/Admin/ManageCategories";
import ManageEmployees from "./pages/Admin/ManageEmployees";
import AuditRequests from "./pages/Admin/AuditRequests";
import ServiceRequests from "./pages/Admin/ServiceRequests";
import Reports from "./pages/Admin/Reports";

// Employee Pages
import UserDashboard from "./pages/Dashboard/UserDashboard";
import BrowseAssets from "./pages/Employee/BrowseAssets";
import AssetDetails from "./pages/Employee/AssetDetails";
import MyAllocations from "./pages/Employee/MyAllocations";
import RaiseRequest from "./pages/Employee/RaiseRequest";
import ServiceRequest from "./pages/Employee/ServiceRequest";
import RequestHistory from "./pages/Employee/RequestHistory";

// Shared Components
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import NotAuthorized from "./pages/Error/NotAuthorized";
import ServerError from "./pages/Error/ServerError";
import NotFound from "./pages/Error/NotFound";
import ErrorBoundary from "./pages/Error/ErrorBoundary";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/user" element={<UserLogin />} />
            <Route path="/logout" element={<Logout />} />

            {/* Admin Routes */}
            <Route
              path="/dashboard/admin"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/admin/assets"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <ManageAssets />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/admin/categories"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <ManageCategories />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/admin/employees"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <ManageEmployees />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/admin/audit"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <AuditRequests />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/admin/service-requests"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <ServiceRequests />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/admin/reports"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <Reports />
                </RoleRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/dashboard/user"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <UserDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/user/assets/browse"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <BrowseAssets />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/user/assets/:id"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <AssetDetails />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/user/allocations"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <MyAllocations />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/user/requests/new"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <RaiseRequest />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/user/requests/service"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <ServiceRequest />
                </RoleRoute>
              }
            />
            <Route
              path="/dashboard/user/requests/history"
              element={
                <RoleRoute allowedRoles={["USER"]}>
                  <RequestHistory />
                </RoleRoute>
              }
            />

            {/* Error Pages */}
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>

        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
