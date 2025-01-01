import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OwnerRegistration.css"; // Import the CSS file
import { app } from "../config/firebase.config.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";

const OwnerRegistration = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // Initialize Firestore
  const db = getFirestore(app);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Check if username already exists
      const ownersRef = collection(db, "owners");
      const usernameQuery = query(ownersRef, where("username", "==", formData.username));
      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty) {
        setError("Username already exists. Please choose another.");
        return;
      }

      // Check if email already exists
      const emailQuery = query(ownersRef, where("email", "==", formData.email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        setError("Email already registered. Please use another email.");
        return;
      }

      // Add new owner to Firestore
      await addDoc(collection(db, "owners"), {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: "owner",
        createdAt: new Date().toISOString(),
      });

      // Navigate to login page after successful registration
      navigate("/owner/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Owner Registration Error:", err);
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
          <button type="submit" className="owner-registration-button">
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