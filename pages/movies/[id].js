import { useRouter } from "next/router";
import useSWR from "swr";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import Layout from "../../components/Layout";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MovieDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSWR(id ? `/api/movies/${id}` : null, fetcher);

  if (error) {
    return (
      <Layout>
        <Container>
          <Alert severity="error">Failed to load movie</Alert>
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
        <Card>
          <CardContent>
            <Typography variant="h3" component="h1" gutterBottom>
              {data.title}
            </Typography>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <Chip label={`Year: ${data.releaseYear}`} />
              <Chip label={`Rating: ${data.rating}`} color="primary" />
            </div>

            <Typography variant="body1" paragraph>
              {data.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
              <strong>Director:</strong> {data.directorName}
            </Typography>

            <Link href={`/movies/${id}/director`} passHref>
              <Button variant="contained" sx={{ mt: 2 }}>
                View Director Info
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
}
