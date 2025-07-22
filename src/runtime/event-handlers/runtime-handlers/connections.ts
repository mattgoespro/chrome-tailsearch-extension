import { RuntimePortMessageSource, isRuntimePort } from "../../../shared/message-event";
import {
  onSettingsPageMessageReceived,
  onPopupPageMessageReceived,
  onContentScriptMessageReceived
} from "./message-handlers";

type ActivePortMap = Map<
  Omit<RuntimePortMessageSource, "content-script"> | number,
  chrome.runtime.Port
>;

const ActivePorts: ActivePortMap = new Map();

export function configurePort(tabId: string | RuntimePortMessageSource, port: chrome.runtime.Port) {
  ActivePorts.set(tabId, port);
  console.log("Added connection for tab:", tabId);

  if (isRuntimePort(tabId)) {
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
        throw new Error(`Connection received from unknown runtime port: ${tabId}`);
    }
  } else {
    port.onMessage.addListener(onContentScriptMessageReceived);

    port.onDisconnect.addListener((disconnectPort) => {
      console.log(disconnectPort);
      ActivePorts.get(tabId).disconnect();
      ActivePorts.delete(tabId);
      console.log(`Unregistered connection for tab: ${tabId}`);
      return true;
    });

    console.log(`Registered content script connection from sender: ${tabId}`);
  }
}

export function withConnectionHandler(handler: (activePorts: ActivePortMap) => void) {
  handler(ActivePorts);
}
