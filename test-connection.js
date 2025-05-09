const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") }); // Explicit path

(async () => {
  // Debug: Check if env is loaded
  console.log(
    "Testing MONGODB_URI:",
    process.env.MONGODB_URI ? "Exists" : "MISSING"
  );

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in .env.local");
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
  });

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas!");
    const db = client.db();
    console.log(`Database name: ${db.databaseName}`);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await client.close();
  }
})();
