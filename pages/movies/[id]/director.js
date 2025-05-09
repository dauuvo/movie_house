import { useRouter } from "next/router";
import useSWR from "swr";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import Layout from "../../../components/Layout";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DirectorInfoPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: movieData, error: movieError } = useSWR(
    id ? `/api/movies/${id}` : null,
    fetcher
  );
  const { data: directorData, error: directorError } = useSWR(
    movieData?.directorId ? `/api/directors/${movieData.directorId}` : null,
    fetcher
  );

  if (movieError || directorError) {
    return (
      <Layout>
        <Container>
          <Alert severity="error">Failed to load data</Alert>
        </Container>
      </Layout>
    );
  }

  if (!movieData || !directorData) {
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

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Link href={`/movies/${id}`} passHref>
          <Button variant="outlined" sx={{ mb: 3 }}>
            Back to Movie
          </Button>
        </Link>

        <Typography variant="h3" component="h1" gutterBottom>
          Director of {movieData.title}
        </Typography>

        <Card>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
              {directorData.name}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Biography:</strong> {directorData.biography}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Other Movies Directed:
            </Typography>
            <ul>
              {directorData.movies
                ?.filter((m) => m.id !== id)
                .map((movie) => (
                  <li key={movie.id}>
                    <Link href={`/movies/${movie.id}`}>
                      <Typography
                        component="a"
                        sx={{ cursor: "pointer", color: "primary.main" }}
                      >
                        {movie.title} ({movie.releaseYear})
                      </Typography>
                    </Link>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
}
