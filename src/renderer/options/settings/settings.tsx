import { Add, AddCard, Create } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormHelperText } from "@mui/material";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { uuid } from "../../../shared/uuid";
import { FlexBox } from "../../shared/components/flex-box";
import { SearchTermInput } from "../../shared/components/search-term-input/search-term-input";
import { usePort } from "../../shared/hooks/use-port";
import { useStorage } from "../../shared/hooks/use-storage";

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

  const Error = useMemo(
    () =>
      error && (
        <Typography color="error" variant="overline">
          Error: {error.message}
        </Typography>
      ),
    [error]
  );

  return (
    <FlexBox direction="column" align="center">
      <Typography variant="h1">TailSearch Settings</Typography>
      <Box width="100%">
        <FormGroup>
          <FormHelperText required>Search Term</FormHelperText>
          <SearchTermInput />
        </FormGroup>
      </Box>
      {error && Error}
      <List dense>
        {!error &&
          !loading &&
          (data?.searchTermOptions ?? []).map((option) => (
            <Paper key={uuid()}>
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
        <ListItem>
          <IconButton disabled size="small" color="primary">
            <Add />
          </IconButton>
        </ListItem>
      </List>
    </FlexBox>
  );
}
