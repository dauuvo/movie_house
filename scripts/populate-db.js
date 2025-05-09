const { MongoClient } = require("mongodb");
const path = require("path");
const fs = require("fs");

// 1. Load environment variables explicitly
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

// 2. Validate the connection string
if (!process.env.MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

// 3. Add debug output
console.log(
  "Using MongoDB URI:",
  process.env.MONGODB_URI.replace(/\/\/[^@]+@/, "//****:****@")
); // Hide password in logs

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  try {
    // 4. Connect with timeout
    console.log("⌛ Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected successfully");

    const db = client.db();

    // 5. Load and validate data file
    const dataPath = path.resolve(__dirname, "../data/data.json");
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found at ${dataPath}`);
    }

    const rawData = fs.readFileSync(dataPath, "utf8");
    const data = JSON.parse(rawData);

    // 6. Clear existing collections
    console.log("🧹 Clearing existing collections...");
    await db.collection("movies").deleteMany({});
    await db.collection("genres").deleteMany({});
    await db.collection("directors").deleteMany({});

    // 7. Insert new data
    console.log("📥 Inserting data...");
    const results = await Promise.all([
      db.collection("movies").insertMany(data.movies),
      db.collection("genres").insertMany(data.genres),
      db.collection("directors").insertMany(data.directors),
    ]);

    console.log(`
      🎉 Data populated successfully:
      Movies: ${results[0].insertedCount}
      Genres: ${results[1].insertedCount}
      Directors: ${results[2].insertedCount}
    `);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
