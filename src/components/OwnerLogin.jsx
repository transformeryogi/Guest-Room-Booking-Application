import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";
import { app } from '../config/firebase.config.js';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

const OwnerLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Initialize Firestore
  const db = getFirestore(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Query Firestore to find user with matching username and password
      const usersRef = collection(db, "owners");
      const q = query(
        usersRef, 
        where("username", "==", username),
        where("password", "==", password) // **Avoid storing plaintext passwords in production**
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid username or password");
        return;
      }

      // Get the first matching user
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Update last login time
      await setDoc(doc(db, "owners", userDoc.id), {
        ...userData,
        lastLogin: new Date().toISOString()
      }, { merge: true });

      // Store user info in localStorage
      localStorage.setItem("userId", userDoc.id);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("email", userData.email); // Store the email in localStorage
      localStorage.setItem("isuser", "admin");
      // Navigate to the guestrooms page on success
      navigate("/guestrooms");
      alert("Logged in successfully");

    } catch (error) {
      // Handle Firebase or network errors
      setError("Login failed. Please check your connection and try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="user-login-container">
      <div className="user-login-card">
        <h2 className="user-login-title">Admin Login</h2>
        {error && <p className="user-error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="user-input-group">
            <label htmlFor="username" className="user-input-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="user-input-field"
              placeholder="Enter your username"
            />
          </div>
          <div className="user-input-group">
            <label htmlFor="password" className="user-input-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="user-input-field"
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit"
            className="user-login-button">
            LOGIN
          </button>
        </form>
        <div className="user-register-link">
          <p className="user-register-text">New User?</p>
          <button
            onClick={() => navigate("/owner-registration")}
            className="user-register-button"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;
