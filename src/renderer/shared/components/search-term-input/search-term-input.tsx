import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { useStorage } from "../../hooks/use-storage";
import { usePort } from "../../hooks/use-port";

export function SearchTermInput() {
  const { data, loading, error } = useStorage();
  const { postMessage } = usePort();

  function onValueChange(_event: React.SyntheticEvent, value: string) {
    postMessage("set-current-search-term-option", {
      data: {
        searchTerm: value
      }
    });
  }

  return (
    <FormControl required>
      <Autocomplete
        value={data?.currentSearchTermOption ?? null}
        loading={loading}
        loadingText="Loading..."
        options={!loading && data.searchTermOptions != null ? data.searchTermOptions : []}
        noOptionsText={error != null ? error.message : "No options"}
        onChange={onValueChange}
        renderInput={(params) => <TextField {...params} color="primary" size="small" />}
      />
    </FormControl>
  );
}
