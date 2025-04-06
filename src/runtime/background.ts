import { onContextMenuOptionClicked } from "./context-menu";
import { onInstalled, onBackgroundReceivedConnection, onTabActivated } from "./event-handlers";

/**
 * Runtime event listeners
 */
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onConnect.addListener(onBackgroundReceivedConnection);

chrome.tabs.onActivated.addListener(onTabActivated);

/**
 * Context menu event listeners
 * @see https://developer.chrome.com/docs/extensions/reference/contextMenus/
 */
chrome.contextMenus.onClicked.addListener(onContextMenuOptionClicked);
