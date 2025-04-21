export const TailSearchContextMenuOptionId = "searchAppendedText";
export const TailSearchContextMenuOptionDisabledOptionLabel =
  "Configure and select a TailSearch search term option to search by.";

export function getContextMenuOptionTitle(selectedText: string, appendText: string) {
  return `TailSearch '${selectedText} ${appendText}'`;
}

export async function updateContextMenu(
  id: string,
  item: Partial<chrome.contextMenus.UpdateProperties>
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
  return updateContextMenu(TailSearchContextMenuOptionId, {
    title: TailSearchContextMenuOptionDisabledOptionLabel,
    enabled: false
  });
}
