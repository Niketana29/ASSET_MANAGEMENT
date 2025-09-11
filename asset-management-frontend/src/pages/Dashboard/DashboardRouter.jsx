
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import authService from "../../services/authService";

export default function DashboardRouter() {
  const user = authService.getCurrentUser();
  const role = user?.roles?.toUpperCase() || "";

  if (role.includes("ADMIN")) return <AdminDashboard></AdminDashboard>;
  if (role.includes("USER")) return <UserDashboard></UserDashboard>;

  return <Navigate to="/login" />;
}
