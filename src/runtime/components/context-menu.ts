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

      resolve();
    });
  });
}
