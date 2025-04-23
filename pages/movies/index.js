import fs from "fs";
import path from "path";
import Link from "next/link";
import { useState } from "react";

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "data.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);

  return {
    props: {
      movies: data.movies,
      genres: data.genres,
    },
    revalidate: 10, // ISR enabled
  };
}

export default function MoviesPage({ movies, genres }) {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const filteredMovies = selectedGenre
    ? movies.filter((movie) => movie.genreId === selectedGenre)
    : movies;

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Movies</h1>

      {/* Genre Filter Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setSelectedGenre(null)}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: selectedGenre === null ? "#555" : "#ccc",
            color: selectedGenre === null ? "#fff" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              backgroundColor: selectedGenre === genre.id ? "#555" : "#ccc",
              color: selectedGenre === genre.id ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Movie Cards */}
      {filteredMovies.length === 0 ? (
        <p>No movies found for this genre.</p>
      ) : (
        filteredMovies.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "15px",
              padding: "10px",
              borderRadius: "6px",
            }}
          >
            <Link
              href={`/movies/${movie.id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <h3>{movie.title}</h3>
            </Link>
            <p>
              <strong>Release Year:</strong> {movie.releaseYear}
            </p>
            <p>
              <strong>Rating:</strong> {movie.rating}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
