import { RuntimePortMessageSource } from "../../../shared/message-event";
import { onSettingsPageMessageReceived, onPopupPageMessageReceived } from "./message-handlers";

type ActivePortMap = Map<
  Omit<RuntimePortMessageSource, "content-script"> | number,
  chrome.runtime.Port
>;

const ActivePorts: ActivePortMap = new Map();

export function configurePort(source: RuntimePortMessageSource, port: chrome.runtime.Port) {
  ActivePorts.set(source, port);

  /**
   * Known runtime ports are only registered once, so they do not need to be disconnected.
   */
  switch (source) {
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
      throw new Error(`Attempted to configure port from unrecognized runtime port: ${source}`);
  }
}

export function withConnectionHandler(
  connectionId: string | number,
  handler: (connectionPort: chrome.runtime.Port, activePorts: ActivePortMap) => void
) {
  if (!ActivePorts.has(connectionId)) {
    throw new Error(`Attempted to use unregistered connection: ${connectionId}`);
  }

  handler(ActivePorts.get(connectionId), ActivePorts);
}
