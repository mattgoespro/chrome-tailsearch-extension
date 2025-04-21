import { ThemeProvider } from "@emotion/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { PortContext } from "./contexts/port-context";
import { queryClient } from "./hooks/query-client";
import { theme } from "./theme/theme";
import { TailsearchChromeStorageKey } from "../../shared/storage";
import { RuntimePortMessageSource } from "../../shared/message-event";
import { ReactNode } from "react";

export function createPage(source: RuntimePortMessageSource, page: ReactNode) {
  const root = document.getElementById("root");

  chrome.storage.onChanged.addListener(() => {
    console.log("Storage changed, refetching queries");
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
