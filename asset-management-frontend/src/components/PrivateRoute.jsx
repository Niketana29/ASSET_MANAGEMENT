import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";

export default function PrivateRoute({ children, role }) {
  const user = AuthService.getCurrentUser();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
