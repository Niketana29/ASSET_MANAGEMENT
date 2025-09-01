import { useState } from "react";
import { useNavigate } from "react-router-dom"
import AuthService from "../services/AuthService";

export default function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const [apiErrors, setApiErrors] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {

        let newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        return newErrors;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setApiErrors("");

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {

            setErrors(validationErrors);
        }
        else {

            setErrors({});
            try {
                const response = await AuthService.login({
                    username: formData.username,
                    password: formData.password
                });

                const userData = {
                    username: response.data.username,
                    role: response.data.roles
                };


                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(userData));

                alert("Login successful!");
                navigate("/dashboard");
            }
            catch (error) {
                setApiErrors(error.response?.data?.message || "Invalid Username or Password");
            }

        }
    };

    return (
        <>
            <div className="container mt-5" style={{ maxWidth: 420 }}>
                <h2 className="mb-4">User Login</h2>

                {apiErrors && <div className="alert alert-danger">{apiErrors}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            className="form-control"
                            type="text"
                            name="username"
                            placeholder="Enter Your Username"
                            value={formData.username}
                            onChange={handleChange}
                            required></input>
                        {errors.username && (<small className="text-danger">{errors.username}</small>)}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            placeholder="Enter Your Password"
                            value={formData.password}
                            onChange={handleChange}
                            required></input>
                        {errors.password && (<small className="text-danger">{errors.password}</small>)}
                    </div>

                    {/*<div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                            className="form-control"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
    </div> */}


                    <button className="btn btn-primary w-100" type="submit">
                        Login
                    </button>
                </form>
            </div>

        </>
    )
}