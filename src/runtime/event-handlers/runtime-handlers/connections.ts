import { RuntimePortMessageSource } from "../../../shared/message-event";
import { onSettingsPageMessageReceived, onPopupPageMessageReceived } from "./message-handlers";

type ActivePortMap = Map<
  Omit<RuntimePortMessageSource, "content-script"> | number,
  chrome.runtime.Port
>;

const ActivePorts: ActivePortMap = new Map();

export function configurePort(tabId: RuntimePortMessageSource, port: chrome.runtime.Port) {
  ActivePorts.set(tabId, port);
  console.log("Added connection for tab ID:", tabId);

  /**
   * Known runtime ports are only registered once, so they do not need to be disconnected.
   */
  switch (tabId) {
    case "options": {
      port.onMessage.addListener(onSettingsPageMessageReceived);
      console.log(`Registered settings page connection.`);
      break;
    }
    case "popup":
      port.onMessage.addListener(onPopupPageMessageReceived);
      console.log(`Registered popup page connection.`);
      break;
    default:
      throw new Error(`Attempted to configure port from unrecognized runtime port: ${tabId}`);
  }
}

export function withConnectionHandler(
  connectionId: string | number,
  handler: (connectionPort: chrome.runtime.Port, activePorts: ActivePortMap) => void
) {
  if (!ActivePorts.has(connectionId)) {
    throw new Error(`Cannot handle tab URL change for unregistered port: ${connectionId}`);
  }

  handler(ActivePorts.get(connectionId), ActivePorts);
}
