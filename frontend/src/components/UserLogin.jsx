import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";
import axios from "axios"; // Add axios

const UserLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/user-login", {
        username,
        password,
      });

      const { userId, username: name, email } = response.data;

      localStorage.setItem("userId", userId);
      localStorage.setItem("username", name);
      localStorage.setItem("email", email);
      localStorage.setItem("isuser", "user");

      alert("Logged in successfully!");
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
        <h2 className="user-login-title">User Login</h2>
        {error && <p className="user-error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="user-input-group">
            <label htmlFor="username" className="user-input-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="user-input-field"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="user-input-group">
            <label htmlFor="password" className="user-input-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="user-input-field"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="user-login-button">LOGIN</button>
        </form>
        <div className="user-register-link">
          <p className="user-register-text">New User?</p>
          <button
            onClick={() => navigate("/user-registration")}
            className="user-register-button"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
