import { useState } from "react";
import useSWR from "swr";
import {
  Container,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import Layout from "../components/Layout";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const { data: movies, error: moviesError } = useSWR("/api/movies", fetcher);
  const { data: genres, error: genresError } = useSWR("/api/genres", fetcher);

  if (moviesError || genresError) {
    return (
      <Layout>
        <Container>
          <Alert severity="error">Failed to load data</Alert>
        </Container>
      </Layout>
    );
  }

  if (!movies || !genres) {
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

  const filteredMovies = selectedGenre
    ? movies.filter((movie) => movie.genreId === selectedGenre)
    : movies;

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          All Movies
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
          Filter by Genre:
        </Typography>

        <ButtonGroup variant="outlined" sx={{ mb: 4 }}>
          <Button
            onClick={() => setSelectedGenre(null)}
            variant={!selectedGenre ? "contained" : "outlined"}
          >
            All
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              variant={selectedGenre === genre.id ? "contained" : "outlined"}
            >
              {genre.name}
            </Button>
          ))}
        </ButtonGroup>

        <Grid container spacing={3}>
          {filteredMovies.length === 0 ? (
            <Grid item xs={12}>
              <Typography>No movies found for this genre.</Typography>
            </Grid>
          ) : (
            filteredMovies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} key={movie.id}>
                <Link href={`/movies/${movie.id}`} passHref>
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
                          {movie.description.substring(0, 100)}...
                        </Typography>
                        <div>
                          <Chip
                            label={`Year: ${movie.releaseYear}`}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={`Rating: ${movie.rating}`}
                            size="small"
                          />
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Layout>
  );
}
