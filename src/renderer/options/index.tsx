import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, QueryOptions } from "@tanstack/react-query";
import { Settings } from "./settings/settings";
import { TailsearchStorage, getChromeStorageData } from "../../shared/storage";
import { PortContext } from "../shared/contexts/port-context";
import { ThemeProvider } from "@mui/material";
import { theme } from "../shared/theme/theme";

(async () => {
  const root = document.getElementById("root");

  const initialData = await getChromeStorageData();
  const queryOptions: QueryOptions<TailsearchStorage> = {
    initialData
  };
  const client = new QueryClient({
    defaultOptions: {
      queries: queryOptions
    }
  });

  const port = chrome.runtime.connect({ name: "settings" });

  createRoot(root).render(
    <ThemeProvider theme={theme}>
      <PortContext.Provider value={port}>
        <QueryClientProvider client={client}>
          <Settings />
        </QueryClientProvider>
      </PortContext.Provider>
    </ThemeProvider>
  );
})();
