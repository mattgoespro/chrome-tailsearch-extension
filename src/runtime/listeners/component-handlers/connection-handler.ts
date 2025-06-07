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

function addPort(tabId: number, port: chrome.runtime.Port) {
  if (!ActivePorts.has(tabId)) {
    ActivePorts.set(tabId, new Set());
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
  console.log(
    `Background received connection from port '${port.name}' in tab '${port.sender?.tab?.id}'`
  );
  const { sender, name } = port;
  const senderTabId = sender?.tab?.id;

  if (sender?.tab?.id == null && !isRuntimePort(name)) {
    console.warn("Port connected without a tab context, ignoring.");
    return true;
  }

  addPort(senderTabId, port);

  switch (port.name) {
    case "content-script":
      port.onMessage.addListener(onContentScriptPortMessageReceived);
      break;
    case "options": {
      port.onMessage.addListener(onSettingsPageMessageReceived);
      break;
    }
    case "popup":
      port.onMessage.addListener(onPopupPageMessageReceived);
      break;
    default:
      console.warn(`Unknown port '${port.name}'!`);
      break;
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
