import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { SettingsPage } from "./settings-page/settings-page";
import React from "react";
import { AppendTextStorageKey } from "../shared/storage";

const root = document.getElementById("root");

chrome.storage.sync.get(AppendTextStorageKey).then((initialData) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000, initialData }
    }
  });

  const port = chrome.runtime.connect({ name: "settings-page" });

  createRoot(root).render(
    <QueryClientProvider client={client}>
      <SettingsPage commPort={port} />
    </QueryClientProvider>
  );
});
