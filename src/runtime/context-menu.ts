import { getStorage } from "../shared/storage";

export const ContextMenuOptionId = "searchAppendedText";
export const ContextMenuOptionDisabledOptionLabel =
  "Configure the text to append from the extension options.";

export async function updateContextMenu(
  id: string,
  item: chrome.contextMenus.UpdateProperties
): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.update(id, item, async () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      console.log(`Updated context menu item '${id}' with properties:`, item);

      resolve();
    });
  });
}

export function getContextMenuOptionTitle(selectedText: string, appendText: string) {
  return `Search Google for '${selectedText} ${appendText}'`;
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

  if (info.menuItemId === ContextMenuOptionId && info.selectionText != null) {
    chrome.tabs.create({
      url: `https://www.google.com/search?q=${encodeURIComponent(`${info.selectionText} ${appendText}`)}`
    });
  }
}

export async function onActionClicked(_tab: chrome.tabs.Tab) {
  const { appendText, selectedText } = await getStorage();

  const searchTerm = [selectedText, appendText].join(" ");

  console.log(`Performing default action with appended text '${searchTerm}'...`);

  if (appendText == null) {
    alert("Please configure the text to append from the extension options.");
    return;
  }

  await chrome.tabs.create({
    url: `https://www.google.com/search?q=${encodeURIComponent(`${selectedText} ${appendText}`)}`,
    active: false
  });
  console.log(`Opened new tab with search query '${searchTerm}'`);
}
