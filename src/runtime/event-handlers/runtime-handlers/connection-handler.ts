import { isRuntimePort } from "../../../shared/message-event";
import { configurePort } from "./connections";

export async function onReceivedConnection(port: chrome.runtime.Port) {
  const { name } = port;

  if (isRuntimePort(name)) {
    configurePort(name, port);
  }

  return true;
}
