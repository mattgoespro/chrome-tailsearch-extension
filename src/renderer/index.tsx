import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, QueryOptions } from "react-query";
import { SettingsPage } from "./settings-page/settings-page";
import React from "react";
import { AppendTextStorage, getStorage } from "../shared/storage";

(async () => {
  const root = document.getElementById("root");

  const initialData = await getStorage();
  const queryOptions: QueryOptions<AppendTextStorage> = {
    initialData
  };
  const client = new QueryClient({
    defaultOptions: {
      queries: queryOptions
    }
  });

  const port = chrome.runtime.connect({ name: "settings-page" });

  createRoot(root).render(
    <QueryClientProvider client={client}>
      <SettingsPage commPort={port} />
    </QueryClientProvider>
  );
})();
