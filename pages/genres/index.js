import fs from "fs";
import path from "path";
import Link from "next/link";

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), "data", "data.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);

  return {
    props: {
      genres: data.genres,
    },
  };
}

export default function GenresPage({ genres }) {
  return (
    <div style={{ padding: "20px", color: "white", backgroundColor: "#111" }}>
      <h1>Browse by Genre</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {genres.map((genre) => (
          <Link key={genre.id} href={`/genres/${genre.id}`}>
            <button
              style={{
                padding: "12px 20px",
                backgroundColor: "#ccc",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {genre.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
