import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function PrivateRoute({ children, role }) {
  const {user} = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role && !user.roles.includes(role.toUpperCase())) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
}
