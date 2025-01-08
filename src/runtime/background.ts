import { onContextMenuOptionClicked } from "./context-menu";
import { onInstalled, onReceivedConnection } from "./event-handlers";

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onConnect.addListener(onReceivedConnection);
chrome.contextMenus.onClicked.addListener(onContextMenuOptionClicked);
