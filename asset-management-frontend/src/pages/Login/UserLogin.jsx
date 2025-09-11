import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginBg from "../../assets/login-bg.jpg";
import { useAuth } from "../../context/AuthContext";

export default function UserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiErrors, setApiErrors] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErrors("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await login(formData); // AuthContext.login
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role !== "EMPLOYEE") {
        setApiErrors("You are not authorized as Employee.");
        return;
      }
      alert("Employee login successful!");
      navigate("/dashboard/user");
    } catch (error) {
      setApiErrors(error.message || "Invalid Email or Password");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="login-card">
        <h2>Employee Login</h2>
        {apiErrors && <div className="alert alert-danger">{apiErrors}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              required
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
              />
              <span className="toggle-password" onClick={togglePassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>
          <button className="btn btn-primary w-100" type="submit">
            Login
          </button>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
