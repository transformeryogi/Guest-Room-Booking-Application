import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const isuser = localStorage.getItem('isuser'); // Check if the user or admin is logged in

  return (
    <div className="navbar">
      <h2 className="navbar-title" onClick={() => navigate('/')}>Guest Houses</h2>
      <nav className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        {username ? (
          <div className="inner">
            <NavLink to="/guestrooms" className={({ isActive }) => (isActive ? 'active' : '')}>
              Guest Rooms
            </NavLink>
            {isuser === 'admin' && ( // Check if the user is an admin
              <>
                <NavLink to="/owner-bookings" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Admin Bookings
                </NavLink>
                <NavLink to="/owner-room-management" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Room Management
                </NavLink>
              </>
            )}
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
              Profile
            </NavLink>
          </div>
        ) : (
          <>
            <NavLink to="/user/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              Login
            </NavLink>
            <NavLink to="/owner/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              Admin
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
