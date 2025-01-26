import { useReducer } from "react";
import {
  StorageContext,
  StorageDispatchContext,
  storageReducer
} from "../contexts/storage-context";

type StorageProviderProps = {
  children: React.ReactNode;
};

export function StorageProvider(props: StorageProviderProps) {
  const [storage, dispatch] = useReducer(storageReducer, {});

  return (
    <StorageContext.Provider value={storage}>
      <StorageDispatchContext.Provider value={dispatch}>
        {props.children}
      </StorageDispatchContext.Provider>
    </StorageContext.Provider>
  );
}
