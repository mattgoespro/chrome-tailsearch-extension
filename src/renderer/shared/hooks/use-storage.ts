import { useQuery } from "@tanstack/react-query";
import {
  getChromeStorageData,
  TailsearchChromeStorageKey,
  TailsearchStorage,
  updateChromeStorageData
} from "@shared/storage";
import { Dispatch, SetStateAction } from "react";

type TailsearchStorageResult = {
  data: TailsearchStorage;
  loading?: boolean;
  error?: Error | null;
};

export function useStorage(): [
  TailsearchStorageResult,
  Dispatch<SetStateAction<TailsearchStorage>>
] {
  const {
    data,
    isLoading: loading,
    error
  } = useQuery<TailsearchStorage, Error, TailsearchStorage>({
    queryKey: [TailsearchChromeStorageKey],
    queryFn: getChromeStorageData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: false
  });

  return [
    {
      data,
      loading,
      error
    },
    updateChromeStorageData
  ];
}
