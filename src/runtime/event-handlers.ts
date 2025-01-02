import { ContextMenuOptionDisabledOptionLabel, onActionClicked } from "./context-menu";
import { getStorage, updateStorage } from "../shared/storage";
import { ContextMenuOptionId } from "./context-menu";
import { onRuntimePortMessageReceived } from "./port-message-handlers";

export async function onInstalled() {
  // Set default data on install
  const initialData = process.env.EXTENSION_STORAGE_INITIAL_DATA;

  if (initialData != null) {
    await updateStorage(JSON.parse(process.env.EXTENSION_STORAGE_INITIAL_DATA));
  }

  chrome.contextMenus.create({
    id: ContextMenuOptionId,
    title: ContextMenuOptionDisabledOptionLabel,
    enabled: false,
    contexts: ["selection"]
  });

  chrome.action.onClicked.addListener(onActionClicked);
}

export async function onRuntimeConnect(port: chrome.runtime.Port) {
  console.log(`Runtime connected from ${port.name}...`);

  switch (port.name) {
    case "content-script":
    case "settings-page": {
      port.onMessage.addListener(onRuntimePortMessageReceived);
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
