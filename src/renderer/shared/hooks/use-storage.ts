import { useQuery } from "@tanstack/react-query";
import {
  getChromeStorageData,
  TailsearchChromeStorageKey,
  TailsearchStorage
} from "@shared/storage";
import { useContext } from "react";
import { PortContext } from "../contexts/port-context";
import { RuntimePortMessageType } from "../../../shared/message-event";

type TailsearchStorageQueryResult = {
  data: TailsearchStorage;
  loading?: boolean;
  error?: Error;
};

type TailsearchStorageSendMessageFn = (
  type: RuntimePortMessageType,
  message: Partial<TailsearchStorage>
) => void;

export function useStorage(): [TailsearchStorageQueryResult, TailsearchStorageSendMessageFn] {
  const { port, source } = useContext(PortContext);

  const {
    data,
    isLoading: loading,
    error
  } = useQuery({
    queryKey: [TailsearchChromeStorageKey],
    queryFn: getChromeStorageData,
    behavior: {
      onFetch: () => {
        console.log("Fetching data from Chrome storage...");
      }
    }
  });

  const sendStorageUpdateMessage: TailsearchStorageSendMessageFn = (
    type: RuntimePortMessageType,
    message: Partial<TailsearchStorage>
  ) => {
    port.postMessage({
      source,
      type,
      data: message
    });
  };

  return [
    {
      data,
      loading,
      error
    },
    sendStorageUpdateMessage
  ];
}
