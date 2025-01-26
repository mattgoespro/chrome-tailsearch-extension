import { createContext } from "react";
import { TailsearchStorage } from "../../../shared/storage";

type StorageContextProps = TailsearchStorage;

export const StorageContext = createContext<StorageContextProps>({});
export const StorageDispatchContext = createContext(null);

type StorageActionType = "set" | "update" | "delete" | "reset";

export function storageReducer(
  state: StorageContextProps,
  action: { type: StorageActionType; payload: Record<string, unknown> }
): StorageContextProps {
  switch (action.type) {
    case "set":
      return {
        ...state,
        ...action.payload
      };
    case "update":
      return {
        ...state,
        ...action.payload
      };
    case "delete":
      const newState = { ...state };
      for (const key of Object.keys(action.payload)) {
        delete newState[key];
      }
      return newState;
    case "reset":
      return {};
    default:
      return state;
  }
}
