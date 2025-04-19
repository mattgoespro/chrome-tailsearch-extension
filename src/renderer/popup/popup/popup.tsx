import { useStorage } from "../../shared/hooks/use-storage";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { TailsearchTermInput } from "../../shared/components/tailsearch-term-input/tailsearch-term-input";
import Box from "@mui/material/Box";

export function ActionPopup() {
  const [storage] = useStorage();

  return (
    <Container>
      <Typography variant="h3" textAlign="center">
        Quick Select Search Term
      </Typography>
      <Container
        sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}
      >
        {storage.loading && <Typography variant="body1">Loading...</Typography>}
        {storage.error && <Typography variant="body1">Error: {storage.error.message}</Typography>}
        {!storage.error && storage.data?.options?.length > 0 && <TailsearchTermInput />}
        <Box marginTop={4}>
          <Link
            variant="button"
            underline="hover"
            href="/settings.html"
            target="_blank"
            textTransform="none"
          >
            Open Settings to add or remove options.
          </Link>
        </Box>
      </Container>
    </Container>
  );
}
