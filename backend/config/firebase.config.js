// firebase-admin-config.js
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Read service account JSON file
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "yogesh-in-paavangal-firebase-adminsdk-k95m0-a66ea819cd.json"), "utf-8")
);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "yogesh-in-paavangal.appspot.com", // correct bucket
  });
}

// Firestore and Storage
const db = admin.firestore();
const storage = admin.storage().bucket();

module.exports = { admin, db, storage };



