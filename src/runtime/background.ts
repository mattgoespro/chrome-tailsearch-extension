import { onReceivedConnection } from "./event-handlers/runtime-handlers/connection-handler";
import { onContextMenuOptionClicked } from "./event-handlers/component-handlers/context-menu-handler";
import { onInstalled } from "./event-handlers/runtime-handlers/runtime-handler";
import { onTabUpdated } from "./event-handlers/component-handlers/tab-handler";

/**
 * Listeners related to the extension lifecycle.
 */
chrome.runtime.onInstalled.addListener(onInstalled);

/**
 * Listeners related to the connection between extension pages, content scripts, and the background service worker.
 */
chrome.runtime.onConnect.addListener(onReceivedConnection);

/**
 * Listeners related to the context menu.
 */
chrome.contextMenus.onClicked.addListener(onContextMenuOptionClicked);

/**
 * Listeners related to the tab lifecycle.
 */
// Listen for forward/backward navigation in the current tab.
chrome.tabs.onUpdated.addListener(onTabUpdated);
