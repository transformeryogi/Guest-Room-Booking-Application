const express = require("express");
const cors = require("cors");
const { db, storage } = require("./config/firebase.config.js"); // Firebase Admin initialized here

const app = express();
app.use(cors());
app.use(express.json());

// User Login
app.post("/api/user-login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("username", "==", username)
      .where("password", "==", password) // ⚠️ Use hashed passwords in production!
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Update lastLogin timestamp
    await usersRef.doc(userDoc.id).set(
      {
        ...userData,
        lastLogin: new Date().toISOString(),
      },
      { merge: true }
    );

    res.status(200).json({
      userId: userDoc.id,
      username: userData.username,
      email: userData.email || "",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error during login." });
  }
});

// Owner Login
app.post("/api/owner-login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const ownersRef = db.collection("owners");
    const snapshot = await ownersRef
      .where("username", "==", username)
      .where("password", "==", password) // ⚠️ Hash in production!
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const ownerDoc = snapshot.docs[0];
    const ownerData = ownerDoc.data();

    // Update lastLogin timestamp
    await ownersRef.doc(ownerDoc.id).set(
      {
        ...ownerData,
        lastLogin: new Date().toISOString(),
      },
      { merge: true }
    );

    res.status(200).json({
      userId: ownerDoc.id,
      username: ownerData.username,
      email: ownerData.email || "",
    });
  } catch (err) {
    console.error("Owner login error:", err);
    res.status(500).json({ error: "Internal server error during login." });
  }
});

// Owner Registration
app.post("/api/owner-register", async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const ownersRef = db.collection("owners");

    // Check username existence
    const usernameSnap = await ownersRef.where("username", "==", username).get();
    if (!usernameSnap.empty) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Check email existence
    const emailSnap = await ownersRef.where("email", "==", email).get();
    if (!emailSnap.empty) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // Add new owner
    await ownersRef.add({
      fullName,
      username,
      email,
      password, // ⚠️ Hash passwords in production!
      userType: "owner",
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Owner registered successfully." });
  } catch (err) {
    console.error("Owner registration error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// User Registration
app.post("/api/user-register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const usersRef = db.collection("users");

    // Check username existence
    const usernameSnap = await usersRef.where("username", "==", username).get();
    if (!usernameSnap.empty) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Check email existence
    const emailSnap = await usersRef.where("email", "==", email).get();
    if (!emailSnap.empty) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // Add new user
    await usersRef.add({
      username,
      email,
      password, // ⚠️ Hash passwords in production!
      userType: "guest",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("User registration error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get All Bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const bookingsSnapshot = await db.collection("bookings").get();
    const bookings = bookingsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp ? data.timestamp.seconds : 0,
      };
    });
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
});

// Delete Booking by ID
app.delete("/api/bookings/:id", async (req, res) => {
  const bookingId = req.params.id;

  try {
    await db.collection("bookings").doc(bookingId).delete();
    res.status(200).json({ message: "Booking deleted successfully." });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Failed to delete booking." });
  }
});

// Get All Rooms
app.get("/api/rooms", async (req, res) => {
  try {
    const roomsSnapshot = await db.collection("rooms").get();
    const rooms = roomsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms." });
  }
});

// Add New Room
app.post("/api/rooms", async (req, res) => {
  try {
    const {
      name,
      address,
      title,
      size,
      sleeps,
      amenities,
      price,
      originalPrice,
      availableCount,
      images,
      acType,
    } = req.body;

    const roomData = {
      name,
      address,
      title,
      size,
      sleeps,
      amenities,
      price,
      originalPrice,
      availableCount,
      images,
      acType,
    };

    const docRef = await db.collection("rooms").add(roomData);
    res.status(201).json({ id: docRef.id, ...roomData });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Failed to add room." });
  }
});

// Update Room
app.put("/api/rooms/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    const {
      name,
      address,
      title,
      size,
      sleeps,
      amenities,
      price,
      originalPrice,
      availableCount,
      images,
      acType,
    } = req.body;

    const roomData = {
      name,
      address,
      title,
      size,
      sleeps,
      amenities,
      price,
      originalPrice,
      availableCount,
      images,
      acType,
    };

    const roomRef = db.collection("rooms").doc(roomId);
    await roomRef.update(roomData);
    res.status(200).json({ message: "Room updated successfully." });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Failed to update room." });
  }
});

// Delete Room
app.delete("/api/rooms/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    await db.collection("rooms").doc(roomId).delete();
    res.status(200).json({ message: "Room deleted successfully." });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room." });
  }
});

// Get Booked Room IDs
app.get("/api/booked-rooms", async (req, res) => {
  try {
    const bookingsSnapshot = await db.collection("bookings").get();
    const bookedRoomIds = bookingsSnapshot.docs.map((doc) => doc.data().roomId);
    res.status(200).json(bookedRoomIds);
  } catch (err) {
    console.error("Error fetching booked rooms:", err);
    res.status(500).json({ error: "Failed to fetch booked rooms." });
  }
});

// Book a Room
app.post("/api/book-room", async (req, res) => {
  const {
    roomId,
    userName,
    userAddress,
    userPhone,
    checkInDate,
    checkOutDate,
    checkInTime,
    checkOutTime,
    price,
  } = req.body;

  if (!roomId || !userName || !userAddress || !userPhone || !checkInDate || !checkOutDate) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  try {
    const roomRef = db.collection("rooms").doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return res.status(404).json({ error: "Room not found." });
    }

    const roomData = roomDoc.data();
    if (!roomData.availableCount || roomData.availableCount <= 0) {
      return res.status(400).json({ error: "No available rooms left." });
    }

    // Add booking
    await db.collection("bookings").add({
      roomId,
      userName,
      userAddress,
      userPhone,
      checkInDate,
      checkOutDate,
      checkInTime,
      checkOutTime,
      price,
      timestamp: new Date(),
      roomTitle: roomData.title,
      acType: roomData.acType,
    });
const admin = require("firebase-admin");
    // Decrement availableCount atomically
    await roomRef.update({
      availableCount: roomData.availableCount - 1,
    });

    res.status(201).json({ message: "Booking successful." });
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ error: "Failed to book room." });
  }
});

// Start Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
