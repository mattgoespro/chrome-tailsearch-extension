import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ActionPopup } from "./popup/popup";
import { PortContext } from "../shared/contexts/port-context";
import { ThemeProvider } from "@mui/material";
import { theme } from "../shared/theme/theme";
import { queryClient } from "../shared/hooks/query-client";
import { TailsearchChromeStorageKey } from "../../shared/storage";

const root = document.getElementById("root");

chrome.storage.onChanged.addListener(() => {
  queryClient.refetchQueries({
    queryKey: [TailsearchChromeStorageKey],
    exact: true,
    type: "active"
  });
});

createRoot(root).render(
  <ThemeProvider theme={theme}>
    <PortContext.Provider
      value={{
        source: "popup",
        port: chrome.runtime.connect({ name: "popup" })
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ActionPopup />
      </QueryClientProvider>
    </PortContext.Provider>
  </ThemeProvider>
);
