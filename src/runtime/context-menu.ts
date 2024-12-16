import { getStorage } from "../shared/storage";

export const ContextMenuOptionId = "searchAppendedText";
export const ContextMenuOptionDisabledOptionLabel =
  "Configure the text to append from the extension options.";

export async function updateContextMenu(
  id: string,
  item: chrome.contextMenus.UpdateProperties
): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.update(id, item, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      resolve();
    });
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
