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

export function Settings() {
  const [storage] = useStorage();
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1
      }}
    >
      <Typography variant="h1" sx={{ textAlign: "center", marginBottom: 2 }}>
        Tailsearch Settings
      </Typography>
      {(!storage.error && (
        <Container maxWidth="sm">
          <FormGroup>
            <FormHelperText required>Search Term</FormHelperText>
            <TailsearchTermInput />
          </FormGroup>
        </Container>
      )) || (
        <Typography color="error" variant="overline">
          Error: {storage.error.message}
        </Typography>
      )}
      <List dense>
        {storage.data.options?.length > 0 &&
          storage.data.options.map((option) => (
            <ListItem
              key={uuid()}
              secondaryAction={
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Typography variant="body1">{option}</Typography>
            </ListItem>
          ))}
      </List>
    </Container>
  );
}
