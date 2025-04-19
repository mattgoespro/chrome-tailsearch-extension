import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ActionPopup } from "./popup/popup";
import { PortContext } from "../shared/contexts/port-context";
import { ThemeProvider } from "@mui/material";
import { theme } from "../shared/theme/theme";

const root = document.getElementById("root");

createRoot(root).render(
  <ThemeProvider theme={theme}>
    <PortContext.Provider
      value={{
        source: "popup",
        port: chrome.runtime.connect({ name: "popup" })
      }}
    >
      <QueryClientProvider client={new QueryClient()}>
        <ActionPopup />
      </QueryClientProvider>
    </PortContext.Provider>
  </ThemeProvider>
);
