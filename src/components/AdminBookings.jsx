import  { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../config/firebase.config.js";
import "./AdminBookings.css";

const db = getFirestore(app);

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const bookingSnapshot = await getDocs(collection(db, "bookings"));
      const bookingData = bookingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingData);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
      alert("Failed to fetch bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-bookings-container">
      <h1>All Bookings</h1>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Room Title</th>
              <th>Room ID</th>
              <th>User Name</th>
              <th>Check-in Date</th>
              <th>Check-in Time</th>
              <th>Check-out Date</th>
              <th>Check-out Time</th>
              <th>Price</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.roomTitle}</td>
                <td>{booking.roomId}</td>
                <td>{booking.userName}</td>
                <td>{booking.checkInDate}</td>
                <td>{booking.checkInTime || "N/A"}</td>
                <td>{booking.checkOutDate}</td>
                <td>{booking.checkOutTime || "N/A"}</td>
                <td>{booking.price}</td>
                <td>{new Date(booking.timestamp.seconds * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookings;
