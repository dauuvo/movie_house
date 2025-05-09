import useSWR from "swr";
import {
  Container,
  Typography,
  Button,
  ButtonGroup,
  CircularProgress,
  Alert,
} from "@mui/material";
import Layout from "../../components/Layout";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function GenresPage() {
  const { data, error } = useSWR("/api/genres", fetcher);

  if (error) {
    return (
      <Layout>
        <Container>
          <Alert severity="error">Failed to load genres</Alert>
        </Container>
      </Layout>
    );
  }

  if (!data) {
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
          Browse by Genre
        </Typography>

        <ButtonGroup
          variant="contained"
          orientation="vertical"
          fullWidth
          sx={{ gap: 2 }}
        >
          {data.map((genre) => (
            <Link key={genre.id} href={`/genres/${genre.id}`} passHref>
              <Button size="large" sx={{ py: 2, textTransform: "none" }}>
                {genre.name}
              </Button>
            </Link>
          ))}
        </ButtonGroup>
      </Container>
    </Layout>
  );
}
