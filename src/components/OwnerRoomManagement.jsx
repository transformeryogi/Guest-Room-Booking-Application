import { useState,  useEffect  } from "react";
import { addDoc, updateDoc, deleteDoc, doc, collection,getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";
import "./OwnerManagement.css";


const OwnerRoomManagement = () => {
  const [guestRooms, setGuestRooms] = useState([]);

  const roomsCollection = collection(db, "rooms");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getDocs(roomsCollection);
        const rooms = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setGuestRooms(rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const [currentRoom, setCurrentRoom] = useState({
    id: null,
    name: "",
    address: "",
    title: "",
    size: "",
    sleeps: "",
    amenities: "",
    price: "",
    originalPrice: "",
    images: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom({ ...currentRoom, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formattedRoom = {
      ...currentRoom,
      amenities: currentRoom.amenities.split(","),
      images: currentRoom.images.split(","),
    };

    try {
      if (currentRoom.id) {
        const roomDoc = doc(db, "rooms", currentRoom.id);
        await updateDoc(roomDoc, formattedRoom);
      } else {
        await addDoc(roomsCollection, formattedRoom);
      }
      setCurrentRoom({
        id: null,
        name: "",
        address: "",
        title: "",
        size: "",
        sleeps: "",
        amenities: "",
        price: "",
        originalPrice: "",
        images: "",
      });
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  const handleEdit = (room) => {
    setCurrentRoom({ ...room, amenities: room.amenities.join(","), images: room.images.join(",") });
  };

  const handleDelete = async (id) => {
    try {
      const roomDoc = doc(db, "rooms", id);
      await deleteDoc(roomDoc);
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

 
  return (
    <div className="owner-room-management">
      <h1 className="header">Owner Room Management</h1>

      {/* Room Form */}
      <div className="form-container">
        <form onSubmit={handleFormSubmit}>
          <h2>{currentRoom.id ? "Edit Room" : "Add New Room"}</h2>

          <input
            type="text"
            name="name"
            placeholder="Hotel Name"
            value={currentRoom.name}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={currentRoom.address}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="title"
            placeholder="Room Title"
            value={currentRoom.title}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="size"
            placeholder="Room Size"
            value={currentRoom.size}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="sleeps"
            placeholder="Sleeps"
            value={currentRoom.sleeps}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="amenities"
            placeholder="Amenities (comma separated)"
            value={currentRoom.amenities}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="price"
            placeholder="Price"
            value={currentRoom.price}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="originalPrice"
            placeholder="Original Price"
            value={currentRoom.originalPrice}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="images"
            placeholder="Image URLs (comma separated)"
            value={currentRoom.images}
            onChange={handleInputChange}
          />

          <button type="submit">
            {currentRoom.id ? "Update Room" : "Add Room"}
          </button>
        </form>
      </div>

      {/* Display Guest Rooms */}
      <div className="guest-rooms">
        <h2>Guest Rooms</h2>
        {guestRooms.map((room) => (
          <div className="room" key={room.id}>
            <h3>{room.name}</h3>
            <p>{room.address}</p>
            <p>{room.title}</p>
            <p>{room.size}</p>
            <p>Sleeps: {room.sleeps}</p>
            <p>Amenities: {room.amenities.join(", ")}</p>
            <p>Price: {room.price}</p>
            <p>Original Price: {room.originalPrice}</p>
            <img
              src={room.images[0]}
              alt={room.title}
              style={{ width: "200px" }}
            />
            <button onClick={() => handleEdit(room)}>Edit</button>
            <button onClick={() => handleDelete(room.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerRoomManagement;
