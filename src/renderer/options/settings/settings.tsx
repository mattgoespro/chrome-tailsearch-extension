import { useContext, useRef } from "react";
import { updateChromeStorageData } from "../../../shared/storage";
import { RuntimePortMessageEvent } from "../../../shared/message-event";
import { useStorage } from "../../shared/hooks/use-storage";
import { PortContext } from "../../shared/contexts/port-context";
import { TailsearchTermSelect } from "../../shared/components/tailsearch-term-select/tailsearch-term-select";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import { Container, IconButton, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

export function Settings() {
  const [storage] = useStorage();
  const port = useContext(PortContext);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleOnSave() {
    const newValue = (inputRef.current.value ?? "").trim();
    const searchTerm = newValue?.length > 0 ? newValue : null;

    updateChromeStorageData({ searchTerm }).then(() => {
      alert("Saved settings.");

      const msg: RuntimePortMessageEvent<"settings-update-context-menu"> = {
        source: "settings",
        type: "settings-update-context-menu"
      };
      port.postMessage(msg);
    });
  }

  return (
    <Container
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Typography variant="h1" sx={{ marginBottom: 2 }}>
        Tailsearch Settings
      </Typography>
      {(!storage.error && (
        <Container
          sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}
        >
          <Typography variant="overline" color="text.primary">
            Search Term
          </Typography>
          <FormGroup>
            <TailsearchTermSelect />
          </FormGroup>
          <Button
            variant="contained"
            type="submit"
            disabled={storage.loading}
            onClick={handleOnSave}
          >
            Save
          </Button>
        </Container>
      )) || (
        <Typography color="error" variant="overline">
          Error: {storage.error.message}
        </Typography>
      )}
      <List></List>
      {storage.data.options?.length > 0 &&
        storage.data.options.map((option) => (
          <ListItem dense secondaryAction={<IconButton>delete</IconButton>}>
            {option}
          </ListItem>
        ))}
    </Container>
  );
}
