import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminBookings.css";

const AdminBookings = () => {
  const [bookingsByRoom, setBookingsByRoom] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      const bookingData = res.data;

      // Group by roomTitle and sort by timestamp desc
      const grouped = {};
      bookingData.forEach((booking) => {
        const room = booking.roomTitle || "Unknown Room";
        if (!grouped[room]) grouped[room] = [];
        grouped[room].push(booking);
      });

      Object.keys(grouped).forEach((room) => {
        grouped[room].sort((a, b) => b.timestamp - a.timestamp);
      });

      setBookingsByRoom(grouped);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
      alert("Failed to fetch bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, roomTitle) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);

      setBookingsByRoom((prev) => {
        const updatedRoom = prev[roomTitle].filter((b) => b.id !== id);
        const newState = { ...prev };
        if (updatedRoom.length === 0) {
          delete newState[roomTitle];
        } else {
          newState[roomTitle] = updatedRoom;
        }
        return newState;
      });

      alert("Booking deleted successfully.");
    } catch (error) {
      console.error("Error deleting booking: ", error);
      alert("Failed to delete booking. Please try again.");
    }
  };

  return (
    <div className="admin-bookings-container">
      <h1>All Bookings by Room</h1>
      {loading ? (
        <p>Loading bookings...</p>
      ) : Object.keys(bookingsByRoom).length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        Object.entries(bookingsByRoom).map(([roomTitle, bookings]) => (
          <div key={roomTitle} className="room-booking-section">
            <h2>{roomTitle}</h2>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User Name</th>
                  <th>Check-in Date</th>
                  <th>Check-in Time</th>
                  <th>Check-out Date</th>
                  <th>Check-out Time</th>
                  <th>Price</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.userName}</td>
                    <td>{booking.checkInDate}</td>
                    <td>{booking.checkInTime || "N/A"}</td>
                    <td>{booking.checkOutDate}</td>
                    <td>{booking.checkOutTime || "N/A"}</td>
                    <td>{booking.price}</td>
                    <td>
                      {booking.timestamp
                        ? new Date(
                            booking.timestamp.seconds * 1000
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(booking.id, roomTitle)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminBookings;
