import { hasConnection, createConnectionId, registerConnection } from "../../connections";
import { onContentScriptSenderMessageReceived } from "../connect/message-handlers";

/**
 * Manages connections made by the background to content scripts when they are injected into the page
 * after a tab is activated.
 *
 * @param activeInfo
 *
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onActivated
 */
export async function onTabActivated(activeInfo: chrome.tabs.TabActiveInfo) {
  const tab = await chrome.tabs.get(activeInfo.tabId);

  if (tab.url.includes("chrome://")) {
    console.warn(`Ignoring tab with Chrome URL '${tab.url}'.`);
    return;
  }

  const { tabId } = activeInfo;

  if (hasConnection("background")) {
    console.warn(`Background already has a connection to tab '${tabId}'. Skipping injection.`);
    return;
  }

  try {
    // Inject the content script into this active tab
    await chrome.scripting.executeScript({
      target: { tabId },
      injectImmediately: true,
      files: ["js/content-script.js"]
    });

    // Open a connection to the content script loaded in the active tab
    const port = chrome.tabs.connect(tabId, {
      name: "background"
    });

    const connectionId = createConnectionId(activeInfo);
    registerConnection(connectionId, port);

    port.onMessage.addListener(onContentScriptSenderMessageReceived);
  } catch (error) {
    console.error("Failed to connect to content script:", error);
  }
}
