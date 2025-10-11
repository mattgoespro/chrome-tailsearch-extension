import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { RuntimePortMessageSource } from "../../shared/message-event";
import { TailsearchChromeStorageKey } from "../../shared/storage";
import { PortContext } from "./contexts/port-context";
import { theme } from "./theme";

export function createPage(source: RuntimePortMessageSource, page: ReactNode) {
  const root = document.getElementById("root");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        behavior: {
          onFetch: () => {
            console.log("Fetching data from Chrome storage...");
          }
        }
      }
    }
  });

  chrome.storage.onChanged.addListener(() => {
    queryClient.refetchQueries({
      queryKey: [TailsearchChromeStorageKey],
      exact: true,
      type: "all"
    });
  });

  createRoot(root).render(
    <ThemeProvider theme={theme}>
      <PortContext.Provider
        value={{
          source,
          port: chrome.runtime.connect({ name: source })
        }}
      >
        <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>
      </PortContext.Provider>
    </ThemeProvider>
  );
}
