import { useState } from "react"
import PasswordStrengthBar from "../components/PasswordStrengthBar";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import "./Register.css";


export default function Register() {


    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        username: "",
        ename: "",
        email: "",
        password: "",
        confirmPassword: "",
        roles: "",
        gender: "",
        contactNumber: "",
        address: ""
    });

    const [errors, setErrors] = useState({});

    const [apiErrors, setApiErrors] = useState("");


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.username.trim())
            newErrors.username = "Username is required";

        if (!formData.ename.trim())
            newErrors.ename = "Full Name is required";

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (
            !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)
        ) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.roles.trim())
            newErrors.roles = "Role is required (e.g. USER, ADMIN)";


        if (!formData.gender)
            newErrors.gender = "Gender is required";

        if (!/^\d{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Enter a valid 10-digit number";
        }

        if (!formData.address.trim())
            newErrors.address = "Address is required";


        return newErrors;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        try {
            await AuthService.register(formData);
            alert("Registration successful!");

            // Redirect based on role   
            if (formData.roles === "ADMIN") navigate("/login/admin");
            else navigate("/login/user");
        } catch (error) {
            setApiErrors(error.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>User Registration</h2>

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
                            placeholder="Choose a Username"
                            required></input>
                        {errors.username && (<small className="text-danger">{errors.username}</small>)}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            className="form-control"
                            type="text"
                            name="ename"
                            value={formData.ename}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                        {errors.ename && <small className="text-danger">{errors.ename}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            autoComplete="email"
                            required></input>
                        {errors.email && (<small className="text-danger">{errors.email}</small>)}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="********"
                            autoComplete="new-password"
                            required></input>
                        {errors.password && (<small className="text-danger">{errors.password}</small>)}
                        <PasswordStrengthBar password={formData.password} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            className="form-control"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="********"
                            autoComplete="new-password"
                            required></input>
                        {errors.confirmPassword && (<small className="text-danger">{errors.confirmPassword}</small>)}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Roles</label>
                        <select
                            className="form-control"
                            name="roles"
                            value={formData.roles}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Role --</option>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        {errors.roles && (<small className="text-danger">{errors.roles}</small>)}
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select
                            className="form-control"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Gender --</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                        {errors.gender && <small className="text-danger">{errors.gender}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contact Number</label>
                        <input
                            className="form-control"
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            required
                        />
                        {errors.contactNumber && <small className="text-danger">{errors.contactNumber}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            required
                        />
                        {errors.address && <small className="text-danger">{errors.address}</small>}
                    </div>

                    <button className="btn btn-primary w-100" type="submit">
                        Register
                    </button>
                </form>
                <p>
                    Already have an account?
                    <Link to="/login/admin">Admin Login</Link> |
                    <Link to="/login/user">User Login</Link>
                </p>


            </div>
        </div>


    );


}