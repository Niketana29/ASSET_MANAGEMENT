import { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    setUser(AuthService.getCurrentUser());
  }, []);

  const login = async (credentials) => {
    const res = await AuthService.login(credentials);
    setUser(AuthService.getCurrentUser());
    return res;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user) return false;
    const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
    return roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout ,hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
