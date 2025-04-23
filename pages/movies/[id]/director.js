import fs from "fs";
import path from "path";

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

  if (!movie) {
    return {
      notFound: true,
    };
  }

  const director = data.directors.find((d) => d.id === movie.directorId);

  return {
    props: {
      director: director || null,
      movieTitle: movie.title,
    },
    revalidate: 10,
  };
}

export default function DirectorInfoPage({ director, movieTitle }) {
  if (!director) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Director information not found.</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Director of {movieTitle}</h1>
      <h2>{director.name}</h2>
      <p>
        <strong>Biography:</strong> {director.biography}
      </p>
    </div>
  );
}
