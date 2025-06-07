import {
  onContentScriptPortMessageReceived,
  onSettingsPageMessageReceived,
  onPopupPageMessageReceived
} from "../extension-handlers/message-handlers";
import { isRuntimePort, RuntimePortMessageSource } from "../../../shared/message-event";
import { updateChromeStorageData } from "../../../shared/storage";

type ActivePortMap = Map<
  Omit<RuntimePortMessageSource, "content-script"> | number,
  Set<chrome.runtime.Port>
>;

const ActivePorts: ActivePortMap = new Map();

function addPort(tabId: number | RuntimePortMessageSource, port: chrome.runtime.Port) {
  if (!ActivePorts.has(tabId)) {
    console.log(`Creating new port set for tab ID: ${tabId}`);
    ActivePorts.set(tabId, new Set());
  } else {
    console.log(`Adding port to existing active ports with tab ID: ${tabId}`);
  }

  ActivePorts.get(tabId).add(port);

  port.onDisconnect.addListener(() => {
    ActivePorts.get(tabId)?.delete(port);

    if (ActivePorts.get(tabId)?.size === 0) {
      ActivePorts.delete(tabId);
    }

    console.log(`Port disconnected from tab ${tabId}`);
    return true;
  });
}

export function withConnectionHandler(handler: (activePorts: ActivePortMap) => void) {
  handler(ActivePorts);
}

export async function onReceivedConnection(port: chrome.runtime.Port) {
  console.log("Port:", port);
  const { sender, name } = port;
  const senderTabId = sender?.tab?.id != null ? sender.tab.id.toString() : name;
  console.log(
    `Background received connection from port '${port.name}' in tab '${port.sender?.tab?.id}'`
  );

  console.log("Sender tab ID:", senderTabId);
  addPort(senderTabId, port);

  if (isRuntimePort(senderTabId)) {
    switch (senderTabId) {
      case "options": {
        console.log("Adding listener for extension settings page...");
        port.onMessage.addListener(onSettingsPageMessageReceived);
        break;
      }
      case "popup":
        console.log("Adding listener for extension popup page...");
        port.onMessage.addListener(onPopupPageMessageReceived);
        break;
      default:
        console.warn(`Unknown port '${port.name}'!`);
        break;
    }
  } else {
    console.log(`Adding listener for web page content script '${senderTabId}'...`);
    port.onMessage.addListener(onContentScriptPortMessageReceived);
  }

  return true;
}

export async function onTabRemoved(tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) {
  withConnectionHandler((activePorts) => {
    if (activePorts.has(tabId)) {
      activePorts.get(tabId).forEach((port) => port.disconnect());
      activePorts.delete(tabId);
      console.log(`Cleaned up ports for closed tab '${tabId}' in window '${removeInfo.windowId}'`);
    }
  });

  await updateChromeStorageData({
    pageSelectedText: undefined
  });

  return true;
}
