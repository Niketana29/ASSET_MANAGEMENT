import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  const roles = (user.roles || []).map(r => r.trim().toUpperCase()); // normalize
  const normalizedAllowed = (allowedRoles || []).map(r => r.trim().toUpperCase());

  if (normalizedAllowed.length > 0 && !roles.some(r => normalizedAllowed.includes(r))) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
}
