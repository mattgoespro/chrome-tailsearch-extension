import { onContextMenuOptionClicked } from "./listeners/component-handlers/context-menu-handler";
import { onInstalled } from "./listeners/extension-handlers/runtime-handler";
import { onReceivedConnection } from "./listeners/component-handlers/connection-handler";

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onConnect.addListener(onReceivedConnection);
chrome.contextMenus.onClicked.addListener(onContextMenuOptionClicked);
