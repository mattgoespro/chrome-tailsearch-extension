import { onContextMenuOptionClicked } from "./handlers/context-menu/clicked";
import { onBackgroundReceivedConnection } from "./handlers/connect/connect";
import { onInstalled } from "./handlers/runtime/installed";
import { onTabActivated } from "./handlers/tabs/activated";
import { onActionClicked } from "./handlers/action/clicked";

/**
 * Runtime event listeners
 *
 * @see https://developer.chrome.com/docs/extensions/reference/runtime
 */
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onConnect.addListener(onBackgroundReceivedConnection);

/**
 * Action event listeners
 *
 * @see https://developer.chrome.com/docs/extensions/reference/action
 */
chrome.action.onClicked.addListener(onActionClicked);

/**
 * Context menu event listeners
 *
 * @see https://developer.chrome.com/docs/extensions/reference/contextMenus
 */
chrome.contextMenus.onClicked.addListener(onContextMenuOptionClicked);

/**
 * Tabs event listeners
 *
 * @see https://developer.chrome.com/docs/extensions/reference/tabs
 */
chrome.tabs.onActivated.addListener(onTabActivated);
