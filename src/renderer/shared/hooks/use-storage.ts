import { useQuery } from "@tanstack/react-query";
import {
  getChromeStorageData,
  TailsearchChromeStorageKey,
  TailsearchStorage
} from "@shared/storage";

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
    queryFn: getChromeStorageData
  });

  return {
    data,
    loading,
    error
  };
}
