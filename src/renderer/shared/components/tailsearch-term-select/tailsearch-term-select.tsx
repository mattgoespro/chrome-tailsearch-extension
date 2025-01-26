import Autocomplete from "@mui/material/Autocomplete";
import {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  FormControl,
  TextField
} from "@mui/material";
import { RuntimePortMessageEvent } from "../../../../shared/message-event";
import { useContext } from "react";
import { PortContext } from "../../contexts/port-context";
import { useStorage } from "../../hooks/use-storage";

export function TailsearchTermSelect() {
  const port = useContext(PortContext);
  const [storage] = useStorage();

  function onValueChange(
    _event: React.SyntheticEvent,
    value: string,
    _reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<string>
  ) {
    const msg: RuntimePortMessageEvent<"popup-update-append-text-option"> = {
      source: "popup",
      type: "popup-update-append-text-option",
      data: {
        appendText: value
      }
    };
    port.postMessage(msg);
  }

  return (
    <FormControl required variant="outlined">
      <Autocomplete
        disablePortal
        defaultValue={storage.data.searchTerm}
        options={storage.data.options ?? []}
        onChange={onValueChange}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={params.InputLabelProps.content} />}
      />
    </FormControl>
  );
}
