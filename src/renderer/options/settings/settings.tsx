import { useStorage } from "../../shared/hooks/use-storage";
import { TailsearchTermInput } from "../../shared/components/tailsearch-term-input/tailsearch-term-input";
import FormGroup from "@mui/material/FormGroup";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { uuid } from "../../../shared/uuid";
import { FormHelperText } from "@mui/material";
import Paper from "@mui/material/Paper";
import { usePort } from "../../shared/hooks/use-port";

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
    <Container maxWidth="sm">
      <Typography variant="h1" sx={{ textAlign: "center", marginBottom: 2 }}>
        TailSearch Settings
      </Typography>
      {(error == null && (
        <Container maxWidth="sm">
          <FormGroup>
            <FormHelperText required>Search Term</FormHelperText>
            <TailsearchTermInput />
          </FormGroup>
        </Container>
      )) || (
        <Typography color="error" variant="overline">
          Error: {error.message}
        </Typography>
      )}
      {!loading && data.searchTermOptions?.length > 0 && (
        <List dense>
          {data.searchTermOptions.map((option) => (
            <Paper elevation={1} key={uuid()} sx={{ marginBottom: 1 }}>
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
    </Container>
  );
}
