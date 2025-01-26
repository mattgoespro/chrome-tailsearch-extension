import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, QueryOptions } from "@tanstack/react-query";
import { ActionPopup } from "./popup/popup";
import { TailsearchStorage, getChromeStorageData } from "../../shared/storage";
import { PortContext } from "../shared/contexts/port-context";
import { ThemeProvider } from "@mui/material";
import { theme } from "../shared/theme/theme";

(async () => {
  const root = document.getElementById("root");

  const initialData = await getChromeStorageData();
  console.log("Opening popup with initial data:", initialData);

  const queryOptions: QueryOptions<TailsearchStorage> = {
    initialData
  };

  const client = new QueryClient({
    defaultOptions: {
      queries: queryOptions
    }
  });

  const port = chrome.runtime.connect({ name: "popup" });

  createRoot(root).render(
    <ThemeProvider theme={theme}>
      <PortContext.Provider value={port}>
        <QueryClientProvider client={client}>
          <ActionPopup />
        </QueryClientProvider>
      </PortContext.Provider>
    </ThemeProvider>
  );
})();
