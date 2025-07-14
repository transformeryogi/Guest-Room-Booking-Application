import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import OwnerLogin from './components/OwnerLogin';
import UserLogin from './components/UserLogin';
import OwnerRegistration from './Pages/OwnerRegistration';
import UserRegistration from './Pages/UserRegistration';
import './App.css';
import Navbar from './Pages/Navbar';
import GuestRooms from './components/GuestRooms';
import OwnerRoomManagement from './components/OwnerRoomManagement';
import AdminBookings from './components/AdminBookings';
import Profile from './components/Profile'


const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/owner-registration" element={<OwnerRegistration />} />    
      <Route path="/user-registration" element={<UserRegistration />} />  
      <Route path="/guestrooms" element={<GuestRooms />} />
      <Route path='/owner-room-management' element={<OwnerRoomManagement />} />
      <Route path="/owner-bookings" element={<AdminBookings/>} />
      <Route path="/profile" element={<Profile/>} />

    </Routes>
  </Router>
);

export default App;