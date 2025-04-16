import { createContext } from "react";
import { RuntimePortMessageSource } from "../../../shared/message-event";

type PortContextProps = {
  source: RuntimePortMessageSource;
  port: chrome.runtime.Port;
};

export const PortContext = createContext<PortContextProps>(null);
