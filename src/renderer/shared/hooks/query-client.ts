import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000,
      behavior: {
        onFetch: () => {
          console.log("Fetching data from Chrome storage...");
        }
      }
    }
  }
});
