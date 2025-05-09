import { useRouter } from "next/router";
import useSWR from "swr";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import Layout from "../../components/Layout";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function GenreMoviesPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: genreData, error: genreError } = useSWR(
    id ? `/api/genres/${id}/movies` : null,
    fetcher
  );
  const { data: allGenres, error: genresError } = useSWR(
    "/api/genres",
    fetcher
  );

  if (genreError || genresError) {
    return (
      <Layout>
        <Container>
          <Alert severity="error">Failed to load data</Alert>
        </Container>
      </Layout>
    );
  }

  if (!genreData || !allGenres) {
    return (
      <Layout>
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  const genre = allGenres.find((g) => g.id === id);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Genre: {genre?.name || "Unknown"}
        </Typography>

        {genreData.length === 0 ? (
          <Typography variant="body1">
            No movies found in this genre.
          </Typography>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {genreData.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.id}`} passHref>
                <Card>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {movie.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {movie.description}
                      </Typography>
                      <div>
                        <Chip
                          label={`Year: ${movie.releaseYear}`}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip label={`Rating: ${movie.rating}`} size="small" />
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Layout>
  );
}
