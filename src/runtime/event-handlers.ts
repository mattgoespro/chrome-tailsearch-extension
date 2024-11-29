import { ContextMenuOptionDisabledOptionLabel, updateContextMenu } from "./context-menu";
import { getStorage, updateStorage } from "../shared/storage";
import { ContextMenuOptionId } from "./context-menu";

export async function onInstalled() {
  // Default word on install
  await updateStorage({ appendText: null });

  chrome.contextMenus.create({
    id: ContextMenuOptionId,
    title: ContextMenuOptionDisabledOptionLabel,
    enabled: false,
    contexts: ["selection"]
  });
}

export async function onRuntimeConnect(port: chrome.runtime.Port) {
  switch (port.name) {
    case "content-script":
    case "settings-page": {
      port.onMessage.addListener(async (message) => {
        console.log(message);
        switch (message.type) {
          case "text-selected": {
            await updateStorage({ selectedText: message.selectedText });
            break;
          }
          case "update-context-menu": {
            const { appendText } = await getStorage();

            if (appendText == null) {
              await updateContextMenu(ContextMenuOptionId, {
                title: "Configure the text to append from the extension options.",
                enabled: false
              });
              return;
            }

            await updateContextMenu(ContextMenuOptionId, {
              title: `Search Google for 'selected text ${appendText}'`,
              enabled: true
            });
          }
          default:
            throw new Error(`Unknown message type: ${message.type}`);
        }
      });
    }
  }
}

export async function onHotkeyPressed() {
  const { appendText, selectedText } = await getStorage();

  if (appendText == null) {
    console.warn("Please configure the text to append from the extension options.");
    return;
  }

  if (selectedText == null) {
    console.warn("No text selected.");
    return;
  }

  chrome.tabs.create({
    url: `https://www.google.com/search?q=${encodeURIComponent(`${selectedText} ${appendText}`)}`
  });
}

export async function onContextMenuOptionClick(info: chrome.contextMenus.OnClickData) {
  const { appendText } = await getStorage();

  if (appendText == null) {
    await updateContextMenu(ContextMenuOptionId, {
      title: ContextMenuOptionDisabledOptionLabel,
      enabled: false
    });
    return;
  }

  if (info.menuItemId === ContextMenuOptionId && info.selectionText) {
    chrome.tabs.create({
      url: `https://www.google.com/search?q=${encodeURIComponent(`${info.selectionText} ${appendText}`)}`
    });
  }
}

export async function onActionClicked(_tab: chrome.tabs.Tab) {
  const { appendText, selectedText } = await getStorage();
  console.log("appendText", appendText);
  console.log("selectedText", selectedText);

  if (appendText == null || selectedText == null) {
    console.warn("Please configure the text to append from the extension options.");
    return;
  }

  chrome.tabs.create({
    url: `https://www.google.com/search?q=${encodeURIComponent(`${selectedText} ${appendText}`)}`
  });
}
