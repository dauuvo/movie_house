import fs from "fs";
import path from "path";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const filePath = path.join(process.cwd(), "data", "data.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);

  const genre = data.genres.find((g) => g.id.toString() === id);
  const movies = data.movies.filter((movie) => movie.genreId.toString() === id);

  if (!genre) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      genreName: genre.name,
      movies,
    },
  };
}

export default function GenreMoviesPage({ genreName, movies }) {
  return (
    <div style={{ padding: "20px", color: "white", backgroundColor: "#111" }}>
      <h1>Genre: {genreName}</h1>
      {movies.length === 0 ? (
        <p>No movies found in this genre.</p>
      ) : (
        movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #444",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#222",
              borderRadius: "4px",
            }}
          >
            <h3>{movie.title}</h3>
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
