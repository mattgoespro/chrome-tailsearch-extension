import { ContextMenuOptionDisabledOptionLabel, getContextMenuOptionTitle } from "./context-menu";
import { updateChromeStorageData } from "../shared/storage";
import { ContextMenuOptionId } from "./context-menu";
import {
  onContentScriptPortMessageReceived,
  onPopupPortMessageReceived,
  onSettingsPagePortMessageReceived
} from "./port/message-handlers";
import { onActionClicked } from "./action";
import { hasConnection, registerConnection } from "./connections";

export async function onInstalled() {
  const contextMenuCreateProps: chrome.contextMenus.CreateProperties = {
    id: ContextMenuOptionId,
    title: ContextMenuOptionDisabledOptionLabel,
    enabled: false,
    contexts: ["selection"]
  };

  // Set default sync storage data on install
  const { EXTENSION_STORAGE_INITIAL_DATA } = process.env;

  if (EXTENSION_STORAGE_INITIAL_DATA != null) {
    const initialData = JSON.parse(EXTENSION_STORAGE_INITIAL_DATA);

    await updateChromeStorageData(initialData);

    contextMenuCreateProps.enabled = true;
    contextMenuCreateProps.title = getContextMenuOptionTitle("", initialData.appendedText);
  }

  chrome.contextMenus.create(contextMenuCreateProps);

  chrome.action.onClicked.addListener(onActionClicked);
}

/**
 * Manages connections made by the background to content scripts when they are injected into the page
 * after a tab is activated.
 *
 * @param activeInfo
 *
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onActivated
 */
export async function onTabActivated(activeInfo: chrome.tabs.TabActiveInfo) {
  if (hasConnection("background")) {
    console.warn(
      `Background already has a connection to tab '${activeInfo.tabId}'. Skipping injection.`
    );
    return;
  }

  try {
    // Inject the content script into the tab
    await chrome.scripting.executeScript({
      target: { tabId: activeInfo.tabId },
      files: ["js/content-script.js"]
    });

    // Establish the connection
    const port = chrome.tabs.connect(activeInfo.tabId, {
      name: "background"
    });

    registerConnection(port);

    port.onMessage.addListener(onContentScriptPortMessageReceived);
  } catch (error) {
    console.error("Failed to connect to content script:", error);
  }
}

/**
 * Manages connections to the background script are made from the popup and settings page.
 * @param port
 */
export async function onBackgroundReceivedConnection(port: chrome.runtime.Port) {
  console.log(`Background received connection from port '${port.name}'`);

  registerConnection(port);

  switch (port.name) {
    case "settings": {
      port.onMessage.addListener(onSettingsPagePortMessageReceived);
      break;
    }
    case "popup":
      port.onMessage.addListener(onPopupPortMessageReceived);
      break;
    default:
      console.warn(`Received unsupported connection '${port.name}'`);
      break;
  }
}
