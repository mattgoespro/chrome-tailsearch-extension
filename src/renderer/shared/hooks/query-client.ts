import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
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
