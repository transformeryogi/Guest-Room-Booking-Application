import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // axios for API calls
import "./OwnerRegistration.css";

const OwnerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/owner-register", {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      alert("Registration successful! Please login.");
      navigate("/owner/login");
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };
  return (
    <div className="owner-registration-container">
      <div className="owner-registration-card">
        <h1 className="owner-registration-title">Owner Registration</h1>
        {error && <p className="owner-registration-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="owner-registration-field">
            <label className="owner-registration-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="owner-registration-input"
              required
            />
          </div>
          <div className="owner-registration-field">
            <label className="owner-registration-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              className="owner-registration-input"
              required
              minLength="3"
              maxLength="20"
            />
          </div>
          <div className="owner-registration-field">
            <label className="owner-registration-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="owner-registration-input"
              required
            />
          </div>
          <div className="owner-registration-field">
            <label className="owner-registration-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              className="owner-registration-input"
              required
              minLength="6"
            />
          </div>
          <div className="owner-registration-field">
            <label className="owner-registration-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="owner-registration-input"
              required
            />
          </div>
          <button type="submit" className="owner-registration-button " onClick={() => navigate("/owner/login")}>
            REGISTER
          </button>
        </form>
        <div className="owner-registration-footer">
          <p className="owner-registration-footer-text">Already have an account?</p>
          <button
            onClick={() => navigate("/owner/login")}
            className="owner-registration-link"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegistration;