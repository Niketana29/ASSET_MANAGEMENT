
import { Navigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

export default function DashboardRouter() {
  const user = AuthService.getCurrentUser();
  const role = user?.roles?.toUpperCase() || "";

  if (role.includes("ADMIN")) return <AdminDashboard></AdminDashboard>;
  if (role.includes("USER")) return <UserDashboard></UserDashboard>;

  return <Navigate to="/login" />;
}
