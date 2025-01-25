import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, QueryOptions } from "react-query";
import { Settings } from "./settings/settings";
import { AppendTextStorage, getStorage } from "../../shared/storage";

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

  const port = chrome.runtime.connect({ name: "settings" });

  createRoot(root).render(
    <QueryClientProvider client={client}>
      <Settings commPort={port} />
    </QueryClientProvider>
  );
})();
