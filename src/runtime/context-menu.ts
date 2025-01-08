import { getStorage } from "../shared/storage";

export const ContextMenuOptionId = "searchAppendedText";
export const ContextMenuOptionDisabledOptionLabel =
  "Configure the text to append from the extension options.";

export function getContextMenuOptionTitle(selectedText: string, appendText: string) {
  return `Search Google with appended selection '${selectedText} ${appendText}'`;
}

export async function updateContextMenu(
  id: string,
  item: chrome.contextMenus.UpdateProperties
): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.update(id, item, async () => {
      if (chrome.runtime.lastError != null) {
        console.warn(
          `Failed to update context menu item '${id}'. Chrome runtime encountered an error:`,
          chrome.runtime.lastError
        );
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      // console.log(`Updated context menu item '${id}' with properties:`, item);

      resolve();
    });
  });
}

export async function onContextMenuOptionClicked({
  menuItemId,
  selectionText
}: chrome.contextMenus.OnClickData) {
  const { appendText } = await getStorage();

  if (appendText == null) {
    console.warn(
      "Failed to search with appended text. The append text is not configured in the extension options. Disabling the context menu option."
    );
    await updateContextMenu(ContextMenuOptionId, {
      title: ContextMenuOptionDisabledOptionLabel,
      enabled: false
    });
    return;
  }

  if (menuItemId === ContextMenuOptionId && selectionText != null) {
    chrome.tabs.create({
      url: `https://www.google.com/search?q=${encodeURIComponent(`${selectionText} ${appendText}`)}`
    });
  }
}
