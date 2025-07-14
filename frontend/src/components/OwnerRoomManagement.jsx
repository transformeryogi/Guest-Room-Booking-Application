import { useState, useEffect } from "react";
import "./OwnerManagement.css"; // Assuming you have a CSS file for styling
const API_BASE_URL = "http://localhost:5000/api"; // Adjust if deployed

const OwnerRoomManagement = () => {
  const [guestRooms, setGuestRooms] = useState([]);
  
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
    availableCount: "",
    acType: "AC", // Default room type
    images: [],
    newImage: ""
  });

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms`);
      const data = await res.json();
      setGuestRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (currentRoom.newImage.trim()) {
      setCurrentRoom((prev) => ({
        ...prev,
        images: [...prev.images, prev.newImage.trim()],
        newImage: ""
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setCurrentRoom((prev) => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formattedRoom = {
      ...currentRoom,
      amenities: currentRoom.amenities
        ? currentRoom.amenities.split(",").map((item) => item.trim())
        : [],
      availableCount: parseInt(currentRoom.availableCount)
    };

    try {
      if (currentRoom.id) {
        // Update room
        const res = await fetch(`${API_BASE_URL}/rooms/${currentRoom.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedRoom)
        });
        if (!res.ok) throw new Error("Failed to update room");
      } else {
        // Add room
        const res = await fetch(`${API_BASE_URL}/rooms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedRoom)
        });
        if (!res.ok) throw new Error("Failed to add room");
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
        availableCount: "",
        acType: "AC",
        images: [],
        newImage: ""
      });

      fetchRooms(); // Refresh room list
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  const handleEdit = (room) => {
    setCurrentRoom({
      ...room,
      amenities: room.amenities ? room.amenities.join(",") : "",
      newImage: ""
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete room");
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <div className="owner-room-management">
      <h1>Owner Room Management</h1>

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
          type="number"
          name="availableCount"
          placeholder="Available Room Count"
          value={currentRoom.availableCount}
          onChange={handleInputChange}
          required
        />
        <select
          name="acType"
          value={currentRoom.acType}
          onChange={handleInputChange}
        >
          <option value="AC">AC</option>
          <option value="Non-AC">Non-AC</option>
        </select>

        <div className="image-management">
          <div>
            <input
              type="text"
              name="newImage"
              placeholder="Image URL"
              value={currentRoom.newImage}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleAddImage}>
              Add Image
            </button>
          </div>

          <div className="image-preview">
            {currentRoom.images.map((img, index) => (
              <div key={index} style={{ display: "inline-block", marginRight: "8px" }}>
                <img src={img} alt={`Preview ${index}`} style={{ width: "50px", height: "50px" }} />
                <button type="button" onClick={() => handleRemoveImage(index)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit">{currentRoom.id ? "Update Room" : "Add Room"}</button>
      </form>

      <h2>Guest Rooms</h2>
      <div>
        {guestRooms.map((room) => (
          <div
            key={room.id}
            style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px",color:"black" }}
          >
            <h3>{room.name}</h3>
            <p>{room.address}</p>
            <p>{room.title}</p>
            <p>{room.size}</p>
            <p>Sleeps: {room.sleeps}</p>
            <p>Room Type: {room.acType}</p>
            <p>Amenities: {room.amenities ? room.amenities.join(", ") : ""}</p>
            <p>Price: {room.price}</p>
            <p>Original Price: {room.originalPrice}</p>
            <p>Available Rooms: {room.availableCount}</p>
            <div>
              {room.images &&
                room.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${room.title} - ${index}`}
                    style={{ width: "200px", margin: "5px" }}
                  />
                ))}
            </div>
            <button onClick={() => handleEdit(room)}>Edit</button>
            <button onClick={() => handleDelete(room.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerRoomManagement;
