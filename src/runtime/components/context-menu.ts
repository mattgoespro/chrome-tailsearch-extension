export const ContextMenuOptionId = "searchAppendedText";
export const ContextMenuOptionDisabledText =
  "Configure and select a TailSearch search term option to search by.";

export function getContextMenuOptionTitle(selectedText: string, appendText: string) {
  return `TailSearch '${selectedText} ${appendText}'`;
}

export async function updateContextMenu(
  id: string,
  item: Omit<Partial<chrome.contextMenus.CreateProperties>, "id">
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

export async function disableContextMenuOption(): Promise<void> {
  return updateContextMenu(ContextMenuOptionId, {
    title: ContextMenuOptionDisabledText,
    enabled: false
  });
}
