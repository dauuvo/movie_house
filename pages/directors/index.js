import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DirectorsPage() {
  const { data, error } = useSWR("/api/director", fetcher);

  if (error)
    return (
      <div style={{ padding: "20px", color: "#fff" }}>
        Failed to load directors.
      </div>
    );
  if (!data)
    return <div style={{ padding: "20px", color: "#fff" }}>Loading...</div>;

  const { directors, movies } = data;

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#121212",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#fff" }}>
        Directors
      </h1>

      {directors.map((director) => {
        const directedMovies = movies.filter(
          (movie) => movie.directorId === director.id
        );

        return (
          <div
            key={director.id}
            style={{
              marginBottom: "30px",
              padding: "20px",
              backgroundColor: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(255, 255, 255, 0.05)",
            }}
          >
            <h2 style={{ color: "#fff", marginBottom: "10px" }}>
              {director.name}
            </h2>
            <p style={{ color: "#ccc", marginBottom: "10px" }}>
              <strong>Biography:</strong> {director.biography}
            </p>
            <p style={{ color: "#ccc", marginBottom: "6px" }}>
              <strong>Movies Directed:</strong>
            </p>
            <ul style={{ paddingLeft: "20px", color: "#bbb" }}>
              {directedMovies.map((movie) => (
                <li key={movie.id}>{movie.title}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
