import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";
import "./GuestRoom.css";

const GuestRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch rooms data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const roomData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRooms(roomData);
    });
    return () => unsubscribe();
  }, []);

  const handleReserveClick = (room) => {
    setSelectedRoom(room);
    setCheckInDate("");
    setCheckOutDate("");
    setCheckInTime("");
    setCheckOutTime("");
    setUserName("");
    setUserAddress("");
    setUserPhone("");
  };

  const confirmBooking = async () => {
    if (!checkInDate || !checkOutDate || !checkInTime || !checkOutTime || !userName || !userAddress || !userPhone) {
      alert("Please fill out all fields, including check-in and check-out times.");
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    setLoading(true);

    try {
      // Check for existing bookings for the selected room
      const bookingQuery = query(
        collection(db, "bookings"),
        where("roomId", "==", selectedRoom.id),
        where("roomTitle", "==", selectedRoom.title)
      );

      const existingBookingsSnapshot = await getDocs(bookingQuery);

      const hasConflict = existingBookingsSnapshot.docs.some((doc) => {
        const booking = doc.data();
        const existingCheckIn = new Date(booking.checkInDate);
        const existingCheckOut = new Date(booking.checkOutDate);
        return (
          (checkIn >= existingCheckIn && checkIn < existingCheckOut) || // Overlaps with existing check-in
          (checkOut > existingCheckIn && checkOut <= existingCheckOut) || // Overlaps with existing check-out
          (checkIn <= existingCheckIn && checkOut >= existingCheckOut) // Encloses an existing booking
        );
      });

      if (hasConflict) {
        alert("The selected dates are unavailable for this room. Please choose different dates.");
        setLoading(false);
        return;
      }

      // Add new booking
      await addDoc(collection(db, "bookings"), {
        roomTitle: selectedRoom.title,
        roomId: selectedRoom.id,
        checkInDate,
        checkOutDate,
        checkInTime,
        checkOutTime,
        userName,
        userAddress,
        userPhone,
        price: selectedRoom.price,
        timestamp: new Date(),
      });

      alert("Booking confirmed!");
      setSelectedRoom(null);
    } catch (error) {
      console.error("Error booking room:", error);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="guest-room-container">
      <h1>Guest Room Details</h1>
      <div className="rooms-list">
        {rooms.map((room) => (
          <div className="room-card" key={room.id}>
            <div className="room-image">
              <img
                src={room.images && room.images[0] ? room.images[0] : "/default-room.jpg"}
                alt={room.title || "Room"}
                onError={(e) => (e.target.src = "/default-room.jpg")}
              />
            </div>
            <div className="room-details">
              <h3>{room.title || "Untitled Room"}</h3>
              <p>Size: {room.size || "Not available"}</p>
              <p>Sleeps {room.sleeps || "N/A"}</p>
              <p>Amenities: {room.amenities?.length > 0 ? room.amenities.join(", ") : "No amenities listed"}</p>
            </div>
            <div className="room-pricing">
              <p className="price">
                <span className="current-price">${room.price}</span>
                {room.originalPrice && <span className="original-price">${room.originalPrice}</span>}
              </p>
              <button className="reserve-button" onClick={() => handleReserveClick(room)}>
                Reserve
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Your Booking</h2>
            <p>
              <strong>Room:</strong> {selectedRoom.title}
            </p>
            <p>
              <strong>Price:</strong> ${selectedRoom.price}
            </p>
            <div className="user-details">
              <label>
                Name: <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
              </label>
              <label>
                Address: <input type="text" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
              </label>
              <label>
                Phone: <input type="text" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
              </label>
            </div>
            <div className="date-selection">
              <label>
                Check-in Date: <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
              </label>
              <label>
                Check-out Date: <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
              </label>
            </div>
            <div className="time-selection">
              <label>
                Check-in Time: <input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} />
              </label>
              <label>
                Check-out Time: <input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} />
              </label>
            </div>
            <button className="reserve-button" onClick={confirmBooking} disabled={loading}>
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>
            <button className="close-button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestRooms;
