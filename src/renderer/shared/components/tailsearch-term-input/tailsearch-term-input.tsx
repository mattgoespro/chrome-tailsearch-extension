import Autocomplete from "@mui/material/Autocomplete";
import { AutocompleteChangeDetails, AutocompleteChangeReason } from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { RuntimePortMessageName } from "@shared/message-event";
import { useStorage } from "../../hooks/use-storage";
import { usePort } from "../../hooks/use-port";

type TailsearchTermInputProps = {
  messageName: RuntimePortMessageName;
};

export function TailsearchTermInput(props: TailsearchTermInputProps) {
  const { postMessage } = usePort();
  const [storage] = useStorage();

  function onValueChange(
    _event: React.SyntheticEvent,
    value: string,
    _reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<string>
  ) {
    postMessage({
      type: props.messageName,
      data: {
        searchTerm: value
      }
    });
  }

  return (
    <FormControl required variant="outlined" component="fieldset">
      <Autocomplete
        id="searchTerm"
        defaultValue={storage.data.searchTerm}
        options={storage.data.options ?? []}
        onChange={onValueChange}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={undefined} />}
      />
    </FormControl>
  );
}
