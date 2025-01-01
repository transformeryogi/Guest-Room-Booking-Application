import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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

  const handleDelete = async (id) => {
    try {
      // Delete booking from Firestore
      await deleteDoc(doc(db, "bookings", id));

      // Remove booking from UI
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));

      alert("Booking deleted successfully.");
    } catch (error) {
      console.error("Error deleting booking: ", error);
      alert("Failed to delete booking. Please try again.");
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
              <th>User Name</th>
              <th>Check-in Date</th>
              <th>Check-in Time</th>
              <th>Check-out Date</th>
              <th>Check-out Time</th>
              <th>Price</th>
              <th>Timestamp</th>
              <th>Actions</th> {/* Added for the Delete button */}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.roomTitle}</td>
                <td>{booking.userName}</td>
                <td>{booking.checkInDate}</td>
                <td>{booking.checkInTime || "N/A"}</td>
                <td>{booking.checkOutDate}</td>
                <td>{booking.checkOutTime || "N/A"}</td>
                <td>{booking.price}</td>
                <td>{new Date(booking.timestamp.seconds * 1000).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(booking.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookings;
