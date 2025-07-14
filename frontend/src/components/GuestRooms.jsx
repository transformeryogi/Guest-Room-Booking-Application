import "./GuestRoom.css";
import { useState, useEffect } from "react";
import axios from "axios";

const GuestRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tot, setTot] = useState(0);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [currentImageIndices, setCurrentImageIndices] = useState({});

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    const totalAvailable = rooms.reduce(
      (acc, room) => acc + (room.availableCount || 0),
      0
    );
    setTot(totalAvailable);
  }, [rooms]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      console.log("Fetched Rooms:", res.data); // Debug log
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      alert("Failed to load rooms.");
    }
  };

  const handleReserveClick = (room) => {
    console.log("Selected Room:", room); // Debug log
    setSelectedRoom(room);
    setCheckInDate("");
    setCheckOutDate("");
    setCheckInTime("");
    setCheckOutTime("");
    setUserName("");
    setUserAddress("");
    setUserPhone("");
    setRoomCount(1);
  };

  const closeModal = () => {
    setSelectedRoom(null);
  };

  const handleImageClick = (e, roomId, images) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const currentIndex = currentImageIndices[roomId] || 0;

    if (x > width * 0.75) {
      setCurrentImageIndices({
        ...currentImageIndices,
        [roomId]: (currentIndex + 1) % images.length,
      });
    } else if (x < width * 0.25) {
      setCurrentImageIndices({
        ...currentImageIndices,
        [roomId]: (currentIndex - 1 + images.length) % images.length,
      });
    }
  };

  const confirmBooking = async () => {
    console.log("Selected Room in confirmBooking:", selectedRoom); // Debug log

    const roomId = selectedRoom?.id;
    if (!roomId) {
      alert("No room selected.");
      return;
    }

    if (
      !userName ||
      !userAddress ||
      !userPhone ||
      !checkInDate ||
      !checkOutDate
    ) {
      alert("Please fill all booking details.");
      return;
    }

    if (roomCount < 1 || roomCount > selectedRoom.availableCount) {
      alert("Invalid room count selected.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/book-room", {
        roomId,
        userName,
        userAddress,
        userPhone,
        checkInDate,
        checkOutDate,
        checkInTime,
        checkOutTime,
        price: selectedRoom.price,
        roomCount,
      });

      await axios.put(`http://localhost:5000/api/rooms/${roomId}`, {
        availableCount: selectedRoom.availableCount - roomCount,
      });

      alert("✅ Booking confirmed!");
      fetchRooms();
      closeModal();
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "❌ Failed to confirm booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-room-container">
      <h1>Guest Room Details</h1>
      <h2>Total Available Rooms: {tot}</h2>

      <div className="rooms-list">
        {rooms.map((room) => {
          const currentIndex = currentImageIndices[room.id] || 0;
          const currentImage = room.images?.[currentIndex] || "/default-room.jpg";

          return (
            <div className="room-card" key={room.id}>
              <div className="room-image">
                <img
                  src={currentImage}
                  alt={room.title || "Room"}
                  onError={(e) => (e.target.src = "/default-room.jpg")}
                  onClick={(e) =>
                    room.images?.length > 1 && handleImageClick(e, room.id, room.images)
                  }
                  style={{ cursor: room.images?.length > 1 ? "pointer" : "default" }}
                />
                {room.images?.length > 1 && (
                  <div className="image-counter">
                    {currentIndex + 1} / {room.images.length}
                  </div>
                )}
              </div>
              <div className="room-details">
                <h3>{room.title || "Untitled Room"}</h3>
                <p>Size: {room.size || "N/A"}</p>
                <p>Sleeps: {room.sleeps || "N/A"}</p>
                <p>AC Type: {room.acType || "N/A"}</p>
                <p>Amenities: {room.amenities?.join(", ") || "None"}</p>
                <p>Available Rooms: {room.availableCount}</p>
              </div>
              <div className="room-pricing">
                <p className="price">
                  <span className="current-price">₹{room.price}</span>
                  {room.originalPrice && (
                    <span className="original-price">₹{room.originalPrice}</span>
                  )}
                </p>
                <button
                  className="reserve-button"
                  onClick={() => handleReserveClick(room)}
                  disabled={room.availableCount === 0}
                >
                  {room.availableCount === 0 ? "No Available Rooms" : "Reserve"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Your Booking</h2>
            <p><strong>Room:</strong> {selectedRoom.title}</p>
            <p><strong>Price per Room:</strong> ₹{selectedRoom.price}</p>

            <div className="user-details">
              <label>
                Name:
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
              </label>
              <label>
                Room Number:
                <input
                  type="number"
                  min="1"
                  max={selectedRoom.availableCount}
                  value={roomCount}
                  onChange={(e) => setRoomCount(Number(e.target.value))}
                />
              </label>
            </div>

            <div className="date-selection">
              <label>
                Check-in Date:
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </label>
              <label>
                Check-out Date:
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </label>
            </div>

            <div className="time-selection">
              <label>
                Check-in Time:
                <input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                />
              </label>
              <label>
                Check-out Time:
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                />
              </label>
            </div>

            <div className="button-group">
              <button className="reserve-button" onClick={confirmBooking} disabled={loading}>
                {loading ? "Confirming..." : "Confirm Booking"}
              </button>
              <button className="close-button" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestRooms;
