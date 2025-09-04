import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
//import DashboardRouter from "./pages/Dashboard/DashboardRouter";
import AdminLogin from "./pages/Login/AdminLogin";
import UserLogin from "./pages/Login/UserLogin";
import ManageAssets from "./pages/Admin/ManageAssets";
import ManageCategories from "./pages/Admin/ManageCategories";
import ManageEmployees from "./pages/Admin/ManageEmployees";
import AuditRequests from "./pages/Admin/AuditRequests";
import ServiceRequests from "./pages/Admin/ServiceRequests";
import BrowseAssets from "./pages/Employee/BrowseAssets";
import AssetDetails from "./pages/Employee/AssetDetails";
import MyAllocations from "./pages/Employee/MyAllocations";
import RaiseRequest from "./pages/Employee/RaiseRequest";
import ServiceRequest from "./pages/Employee/ServiceRequest";

import PrivateRoute from "./components/PrivateRoute";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/user" element={<UserLogin />} />

        {/* Admin Dashboard Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route path="assets" element={<ManageAssets />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="employees" element={<ManageEmployees />} />
          <Route path="audit" element={<AuditRequests />} />
          <Route path="service-requests" element={<ServiceRequests />} />
        </Route>

        {/* Employee Dashboard Routes */}
        <Route
          path="/dashboard/user"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        >
          <Route path="assets/browse" element={<BrowseAssets />} />
          <Route path="assets/:id" element={<AssetDetails />} />
          <Route path="allocations" element={<MyAllocations />} />
          <Route path="requests/new" element={<RaiseRequest />} />
          <Route path="requests/service" element={<ServiceRequest />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
