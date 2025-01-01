import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserRegistration.css";
import { app } from '../config/firebase.config.js';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");

  // Initialize Firestore
  const db = getFirestore(app);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Check if username already exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", formData.username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Username already exists. Please choose another.");
        return;
      }

      // Check if email already exists
      const emailQuery = query(usersRef, where("email", "==", formData.email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        setError("Email already registered. Please use another email.");
        return;
      }

      // Add new user to Firestore
      await addDoc(collection(db, "users"), {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: 'guest',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      // Navigate to login page after successful registration
      navigate("/user/login");
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2 className="registration-title">User Registration</h2>
        {error && <p className="registration-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="registration-input-group">
            <label htmlFor="username" className="registration-label">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="registration-input"
              minLength="3"
              maxLength="20"
            />
          </div>
          <div className="registration-input-group">
            <label htmlFor="email" className="registration-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="registration-input"
            />
          </div>
          <div className="registration-input-group">
            <label htmlFor="password" className="registration-label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="registration-input"
              minLength="6"
            />
          </div>
          <button type="submit" className="registration-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;