import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, QueryOptions } from "react-query";
import { ActionPopup } from "./action-popup/action-popup";
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
      <ActionPopup commPort={port} appendTextOptions={[]} />
    </QueryClientProvider>
  );
})();
