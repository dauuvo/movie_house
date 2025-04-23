import fs from "fs";
import path from "path";
import Link from "next/link";

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), "data", "data.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);

  const paths = data.movies.map((movie) => ({
    params: { id: movie.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), "data", "data.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);

  const movie = data.movies.find((m) => m.id.toString() === params.id);
  const director = movie
    ? data.directors.find((d) => d.id === movie.directorId)
    : null;

  if (!movie) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      movie,
      directorName: director ? director.name : "Unknown",
    },
    revalidate: 10,
  };
}

export default function MovieDetailPage({ movie, directorName }) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>{movie.title}</h1>
      <p>
        <strong>Description:</strong> {movie.description}
      </p>
      <p>
        <strong>Release Year:</strong> {movie.releaseYear}
      </p>
      <p>
        <strong>Rating:</strong> {movie.rating}
      </p>
      <p>
        <strong>Director:</strong> {directorName}{" "}
        <Link href={`/movies/${movie.id}/director`}>
          <button style={{ marginLeft: "10px" }}>View Director Info</button>
        </Link>
      </p>
    </div>
  );
}
