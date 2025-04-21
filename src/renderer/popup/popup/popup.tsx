import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { TailsearchTermInput } from "../../shared/components/tailsearch-term-input/tailsearch-term-input";
import Box from "@mui/material/Box";
import { FlexColumn } from "../../shared/components/flex-column";

export function ActionPopup() {
  return (
    <Container>
      <Typography variant="h3" textAlign="center">
        Quick Select Search Term
      </Typography>
      <FlexColumn centerHorizontal>
        <TailsearchTermInput />
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
      </FlexColumn>
    </Container>
  );
}
