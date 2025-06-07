import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { SearchTermInput } from "../../shared/components/search-term-input/search-term-input";
import Box from "@mui/material/Box";
import { FlexColumn } from "../../shared/components/flex-column";

export function ActionPopup() {
  return (
    <FlexColumn>
      <Typography variant="h3" textAlign="center">
        Quick Select Search Term
      </Typography>
      <FlexColumn centerHorizontal>
        <SearchTermInput />
        <Box marginTop={4}>
          <Link
            variant="button"
            fontSize="1em"
            underline="hover"
            href="/options.html"
            target="_blank"
            textTransform="none"
          >
            Open Settings to add or remove options.
          </Link>
        </Box>
      </FlexColumn>
    </FlexColumn>
  );
}
