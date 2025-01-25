import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, QueryOptions } from "react-query";
import { ActionPopup } from "./popup/popup";
import { AppendTextStorage, getStorage } from "../../shared/storage";

(async () => {
  const root = document.getElementById("root");

  const initialData = await getStorage();
  console.log("Opening popup with initial data:", initialData);

  const queryOptions: QueryOptions<AppendTextStorage> = {
    initialData
  };

  const client = new QueryClient({
    defaultOptions: {
      queries: queryOptions
    }
  });

  const port = chrome.runtime.connect({ name: "popup" });

  createRoot(root).render(
    <QueryClientProvider client={client}>
      <ActionPopup commPort={port} />
    </QueryClientProvider>
  );
})();
