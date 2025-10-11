import { onReceivedConnection } from "./event-handlers/runtime-handlers/connection-handler";
import { onContextMenuOptionClicked } from "./event-handlers/component-handlers/context-menu-handler";
import { onInstalled } from "./event-handlers/runtime-handlers/runtime-handler";
import { onTabUpdated } from "./event-handlers/component-handlers/tab-handler";
import { onContentScriptMessageReceived } from "./event-handlers/runtime-handlers/message-handlers";

/**
 * Listeners related to the extension lifecycle.
 */
chrome.runtime.onInstalled.addListener(onInstalled);

/**
 * Listeners related to the message communication between extension pages and this background service worker.
 */
chrome.runtime.onConnect.addListener(onReceivedConnection);

/**
 * Listeners related to the message communication between content scripts and this background service worker.
 */
chrome.runtime.onMessage.addListener(onContentScriptMessageReceived);

/**
 * Listeners related to the context menu.
 */
chrome.contextMenus.onClicked.addListener(onContextMenuOptionClicked);

/**
 * Listeners related to the tab lifecycle, especially for handling URL changes during navigation.
 */
chrome.tabs.onUpdated.addListener(onTabUpdated);
