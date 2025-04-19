import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { useStorage } from "../../hooks/use-storage";

export function TailsearchTermInput() {
  const [storage, sendStorageUpdateMessage] = useStorage();

  function onValueChange(_event: React.SyntheticEvent, value: string) {
    sendStorageUpdateMessage("update-search-term-storage", {
      searchTerm: value
    });
  }

  return (
    <FormControl required variant="outlined" component="fieldset">
      <Autocomplete
        id="searchTerm"
        value={storage.data.searchTerm}
        options={storage.data.options ?? []}
        onChange={onValueChange}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={undefined} />}
      />
    </FormControl>
  );
}
