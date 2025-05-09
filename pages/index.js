import fs from "fs";
import path from "path";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "data.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);

  return {
    props: { data },
  };
}

export default function HomePage({ data }) {
  const { movies } = data;
  const router = useRouter();

  const browseGenres = () => {
    router.push("/genres");
  };

  return (
    <Layout>
      <div>
        <h1>Trending Movies</h1>
        {movies
          .filter((movie) => movie.rating > 8.0)
          .map((movie) => (
            <div
              key={movie.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
              }}
            >
              <h3>{movie.title}</h3>
              <p>
                <strong>Description:</strong> {movie.description}
              </p>
              <p>
                <strong>Release Year:</strong> {movie.releaseYear}
              </p>
              <p>
                <strong>Rating:</strong> {movie.rating}
              </p>
            </div>
          ))}
        <button onClick={browseGenres}>Browse Genres</button>
      </div>
    </Layout>
  );
}
