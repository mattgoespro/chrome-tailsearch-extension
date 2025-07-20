import { onReceivedConnection } from "./event-handlers/runtime-handlers/connection-handler";
import { onContextMenuOptionClicked } from "./event-handlers/component-handlers/context-menu-handler";
import { onInstalled } from "./event-handlers/runtime-handlers/runtime-handler";

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
