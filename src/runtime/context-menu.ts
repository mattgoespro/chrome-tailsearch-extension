export const ContextMenuOptionId = "searchAppendedText";

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

export const ContextMenuOptionDisabledOptionLabel =
  "Configure the text to append from the extension options.";
