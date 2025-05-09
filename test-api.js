const assert = require("assert");
const axios = require("axios");
require("dotenv").config({ path: "./.env.local" });

const BASE_URL = "http://localhost:3000/api";

async function testMoviesAPI() {
  try {
    // Test GET /api/movies
    const moviesRes = await axios.get(`${BASE_URL}/movies`);
    assert(Array.isArray(moviesRes.data), "Should return array of movies");
    console.log("✅ GET /api/movies - Success");

    // Test GET /api/movies/[id]
    const testMovie = moviesRes.data[0];
    const movieRes = await axios.get(`${BASE_URL}/movies/${testMovie.id}`);
    assert(
      movieRes.data.title === testMovie.title,
      "Should return correct movie"
    );
    console.log("✅ GET /api/movies/[id] - Success");
  } catch (err) {
    console.error("❌ API Test Failed:", err.message);
  }
}

async function runTests() {
  await testMoviesAPI();
  // Add other test functions here
}

runTests();
