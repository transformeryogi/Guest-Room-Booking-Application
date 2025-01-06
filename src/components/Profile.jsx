import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  // Retrieve user data from localStorage
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('isuser');
    alert("You have Successfully Logout ");
    // Redirect to login page
    navigate('/user/login');
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>
      <div className="profile-card">
        <p className="profile-detail">
          <strong>Username:</strong> {username || 'N/A'}
        </p>
        <p className="profile-detail">
          <strong>Email:</strong> {email || 'N/A'}
        </p>
        <button onClick={handleLogout} className="profile-logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
