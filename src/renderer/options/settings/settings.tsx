import { useStorage } from "../../shared/hooks/use-storage";
import { SearchTermInput } from "../../shared/components/search-term-input/search-term-input";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { uuid } from "../../../shared/uuid";
import { FormHelperText } from "@mui/material";
import Paper from "@mui/material/Paper";
import { usePort } from "../../shared/hooks/use-port";
import { FlexBox } from "../../shared/components/flex-box";
import Box from "@mui/material/Box";

export function Settings() {
  const { data, loading, error } = useStorage();
  const { postMessage } = usePort();

  function handleDeleteOption(event: React.MouseEvent<HTMLButtonElement>) {
    postMessage("remove-search-term-option", {
      data: {
        searchTerm: event.currentTarget.value
      }
    });
  }

  return (
    <FlexBox direction="column" align="center" maxWidth="md">
      <Typography variant="h1">TailSearch Settings</Typography>
      {(error == null && (
        <Box maxWidth="md">
          <FormGroup>
            <FormHelperText required>Search Term</FormHelperText>
            <SearchTermInput />
          </FormGroup>
        </Box>
      )) || (
        <Typography color="error" variant="overline">
          Error: {error.message}
        </Typography>
      )}
      {!loading && data.searchTermOptions?.length > 0 && (
        <List dense>
          {data.searchTermOptions.map((option) => (
            <Paper
              elevation={0.5}
              key={uuid()}
              sx={(theme) => ({
                margin: theme.spacing(1),
                padding: theme.spacing(1),
                backgroundColor: theme.palette.background.paper,
                display: "flex",
                gap: theme.spacing(1)
              })}
            >
              <ListItem
                secondaryAction={
                  <IconButton size="small" edge="end" onClick={handleDeleteOption} value={option}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Typography variant="body1">{option}</Typography>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </FlexBox>
  );
}
