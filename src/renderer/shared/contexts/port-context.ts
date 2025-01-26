import { createContext } from "react";

export const PortContext = createContext<chrome.runtime.Port>(null);
