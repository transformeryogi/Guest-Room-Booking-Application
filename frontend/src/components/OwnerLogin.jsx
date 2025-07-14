import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // use axios for HTTP requests
import "./UserLogin.css";

const OwnerLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/owner-login", {
        username,
        password,
      });

      const { userId, username: name, email } = response.data;

      localStorage.setItem("userId", userId);
      localStorage.setItem("username", name);
      localStorage.setItem("email", email);
      localStorage.setItem("isuser", "admin");

      alert("Logged in successfully");
      navigate("/guestrooms");
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again.");
      }
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
