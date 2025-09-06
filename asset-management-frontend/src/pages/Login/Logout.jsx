import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {  useAuth } from "../../context/AuthContext";

export default function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

  useEffect(() => {
    logout(); 
    navigate("/"); 
  }, [logout, navigate]);

  return null;
}
