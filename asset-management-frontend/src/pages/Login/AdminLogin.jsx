import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginBg from "../../assets/login-bg.jpg";



export default function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [apiErrors, setApiErrors] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(prev => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.username.trim())
            newErrors.username = "Username is required";
        if (!formData.password)
            newErrors.password = "Password is required";
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
            const response = await AuthService.login(formData);

            const roles = (response.roles || "").split(",").map((r) => r.trim().toUpperCase());
            if (!roles.includes("ADMIN")) {
                setApiErrors("You are not authorized as Admin.");
                return;
            }

            localStorage.setItem("token", response.token);
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: response.userId,
                    employeeId: response.employeeId,
                    username: response.username,
                    roles: response.roles,
                    token: response.token
                })
            );


            alert("Admin login successful!");
            navigate("/dashboard/admin");
        } catch (error) {
            setApiErrors(error.response?.data?.message || "Invalid Username or Password");
        }
    };

    return (
        <div className="login-container"
            style={{
                backgroundImage: `url(${loginBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh", 
            }}>
            <div className="login-card">
                <h2>Admin Login</h2>
                {apiErrors && <div className="alert alert-danger">{apiErrors}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            className="form-control"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            required
                        />
                        {errors.username && <small className="text-danger">{errors.username}</small>}
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
