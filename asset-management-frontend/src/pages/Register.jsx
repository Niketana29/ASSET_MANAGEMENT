import { useState } from "react"
import PasswordStrengthBar from "../components/PasswordStrengthBar";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

export default function Register() {


    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const [apiErrors , setApiErrors] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {

        let newErrors = {};

        if (!formData.name.trim())
            newErrors.name = "Name is required";

        if (!formData.email) {

            newErrors.email = "Email is required";
        }
        else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)) {
            newErrors.email = "Email is Invalid";
        }

        if (!formData.password) {

            newErrors.password = "Password is required";
        }
        else if (formData.password.length < 8) {

            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {

            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {

            setErrors(validationErrors);
        }
        else {

            setErrors({});
            try{
                await AuthService.register({
                    name : formData.name,
                    email : formData.email,
                    password : formData.password

                });

                alert("Registration successful! Redirecting to Login...");
                navigate("/login");
            }
            catch(error){
                setApiErrors(error.response?.data?.message || "Registration failed. Try again.");
            }
        }

    };

    return (
        <>
            <div className="container mt-5" style={{ maxWidth: 520 }}>
                <h2 className="mb-4">User Registration</h2>

                {apiErrors && <div className = "alert alert-danger">{apiErrors}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            placeholder= /*Enter Your Name*/ "John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required></input>
                        {errors.name && (<small className="text-danger">{errors.name}</small>)}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            placeholder= /*Enter Your Email Id*/ "john@example.com"
                            value={formData.email}
                            onChange={handleChange}
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
                            placeholder= /*Enter Your Password here*/ "********"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required></input>
                            {errors.password && (<small className="text-danger">{errors.password}</small>)}
                            <PasswordStrengthBar password={formData.password}/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            className="form-control"
                            type="password"
                            name="confirmPassword"
                            placeholder= /*Confirm Your Password*/ "********"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"></input>
                            {errors.confirmPassword && (<small className="text-danger">{errors.confirmPassword}</small>)}
                    </div>

                    <button className="btn btn-primary w-100" type="submit">
                        Register
                    </button>
                </form>
            </div>

        </>
    );


}