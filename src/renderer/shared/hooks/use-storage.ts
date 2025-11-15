import { getStorageData, TailsearchChromeStorageKey, TailsearchStorage } from "@shared/storage";
import { useQuery } from "@tanstack/react-query";

type TailsearchStorageQueryResult = {
  data: TailsearchStorage;
  loading?: boolean;
  error?: Error;
};

export function useStorage(): TailsearchStorageQueryResult {
  const {
    data,
    isLoading: loading,
    error
  } = useQuery({
    queryKey: [TailsearchChromeStorageKey],
    queryFn: getStorageData
  });

  return {
    data,
    loading,
    error
  };
}
