import {
  onActionClicked,
  onContextMenuOptionClick as onContextMenuOptionClicked,
  onHotkeyPressed,
  onInstalled,
  onRuntimeConnect
} from "./event-handlers";

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onConnect.addListener(onRuntimeConnect);
chrome.contextMenus.onClicked.addListener(onContextMenuOptionClicked);
chrome.action.onClicked.addListener(onActionClicked);
chrome.commands.onCommand.addListener(onHotkeyPressed);
