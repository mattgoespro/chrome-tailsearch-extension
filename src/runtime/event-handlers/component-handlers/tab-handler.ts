import { withConnectionHandler } from "../runtime-handlers/connections";

export function onTabUpdated(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  if (changeInfo.url != null) {
    withConnectionHandler((activePorts) => {
      // We need to reconnect the content script port to the new URL.
      const port = activePorts.get(tabId);
      if (port != null) {
        port.postMessage({
          type: "content-script-tab-updated",
          source: "content-script",
          data: { tabId, changeInfo, tab }
        });
        console.log(`Sent tab updated message for tab ${tabId} to content script.`);
      }
    });
  }
}
