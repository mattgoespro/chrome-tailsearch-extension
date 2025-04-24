import { onContextMenuOptionClicked } from "./listeners/component-handlers/context-menu-handler";
import { onInstalled } from "./listeners/extension-handlers/runtime-handler";
import {
  onReceivedConnection,
  onTabRemoved
} from "./listeners/component-handlers/connection-handler";

/**
 * Listeners related to the extension lifecycle.
 */
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onConnect.addListener(onReceivedConnection);

/**
 * Listeners related to the context menu.
 */
chrome.contextMenus.onClicked.addListener(onContextMenuOptionClicked);

/**
 * Listeners related to the tab lifecycle.
 */
chrome.tabs.onRemoved.addListener(onTabRemoved);
