import {
  onContentScriptMessageReceived,
  onSettingsPageMessageReceived,
  onPopupPageMessageReceived
} from "./message-handlers";
import { isRuntimePort, RuntimePortMessageSource } from "../../../shared/message-event";

type ActivePortMap = Map<
  Omit<RuntimePortMessageSource, "content-script"> | number,
  chrome.runtime.Port
>;

const ActivePorts: ActivePortMap = new Map();

function configurePort(tabId: string | RuntimePortMessageSource, port: chrome.runtime.Port) {
  ActivePorts.set(tabId, port);

  if (isRuntimePort(tabId)) {
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
    console.log(`Registered content script connection from sender: ${tabId}`);
  }

  port.onDisconnect.addListener(() => {
    ActivePorts.get(tabId).disconnect();
    ActivePorts.delete(tabId);
    console.log(`Unregistered connection for tab: ${tabId}`);
    return true;
  });
}

export function withConnectionHandler(handler: (activePorts: ActivePortMap) => void) {
  handler(ActivePorts);
}

export async function onReceivedConnection(port: chrome.runtime.Port) {
  const { sender, name } = port;
  const senderTabId = sender?.tab?.id != null ? sender.tab.id.toString() : name;

  configurePort(senderTabId, port);

  return true;
}
