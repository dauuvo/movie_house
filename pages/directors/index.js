import useSWR from "swr";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Layout from "../../components/Layout";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DirectorsPage() {
  const { data: directorsData, error: directorsError } = useSWR(
    "/api/directors",
    fetcher
  );
  const { data: moviesData, error: moviesError } = useSWR(
    "/api/movies",
    fetcher
  );

  if (directorsError || moviesError) {
    return (
      <Layout>
        <Container>
          <Alert severity="error">Failed to load data</Alert>
        </Container>
      </Layout>
    );
  }

  if (!directorsData || !moviesData) {
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
        <Typography variant="h3" component="h1" gutterBottom>
          Directors
        </Typography>

        {directorsData.map((director) => {
          const directedMovies = moviesData.filter(
            (movie) => movie.directorId === director.id
          );

          return (
            <Card key={director.id} sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {director.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Biography:</strong> {director.biography}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Movies Directed:</strong>
                </Typography>
                <List dense>
                  {directedMovies.map((movie) => (
                    <ListItem key={movie.id}>
                      <ListItemText primary={movie.title} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          );
        })}
      </Container>
    </Layout>
  );
}
