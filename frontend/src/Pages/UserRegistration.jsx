import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios for backend calls
import "./UserRegistration.css";

const UserRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/user-register", {
        username,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/user/login");
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Please try again later.");
      }
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
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="registration-input"
              placeholder="Choose a username"
              required
              minLength={3}
              maxLength={20}
            />
          </div>

          <div className="registration-input-group">
            <label htmlFor="email" className="registration-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="registration-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="registration-input-group">
            <label htmlFor="password" className="registration-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="registration-input"
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="registration-button">
            Register
          </button>
        </form>

        <div className="owner-registration-footer">
          <p className="owner-registration-footer-text">Already have an account?</p>
          <button
            onClick={() => navigate("/user/login")}
            className="owner-registration-link"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
