import { withConnectionHandler } from "../runtime-handlers/connections";

export function onTabUpdated(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  if (changeInfo.url != null) {
    withConnectionHandler((activePorts) => {
      if (!activePorts.has(tabId)) {
        throw new Error(`Cannot handle tab URL change for unregistered port: ${tabId}`);
      }

      // We need to reconnect the content script port to the new URL.
      const port = activePorts.get(tabId);
      if (port != null) {
        port.postMessage({
          type: "content-script-tab-updated",
          source: "content-script",
          data: { tabId, changeInfo, tab }
        });
      }
    });
  }
}
