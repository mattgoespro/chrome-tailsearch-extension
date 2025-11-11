// import { RuntimePortMessageEvent } from "../../../shared/message-event";
// import { withConnectionHandler } from "../runtime-handlers/connections";

export function onTabUpdated(
  _tabId: number,
  _changeInfo: chrome.tabs.OnUpdatedInfo,
  _tab: chrome.tabs.Tab
) {
  /**
   * TODO: Does the tab need to notify the content script about URL changes, or will the content script detect that itself and reconnect to the background script as needed?
   */
  // if (changeInfo.url != null) {
  //   withConnectionHandler(tabId, (port) => {
  //     // Notify the content script in the updated tab about the URL change so that it can reconnect to the background script.
  //     port.postMessage(<RuntimePortMessageEvent<"content-script-tab-updated">>{
  //       type: "content-script-tab-updated",
  //       source: "content-script",
  //       data: { tabId, changeInfo, tab }
  //     });
  //   });
  // }
}
