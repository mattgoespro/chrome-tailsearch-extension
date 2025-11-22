export const TailsearchContextMenuOptionId = "tailsearch-context-menu-option";
export const TailsearchContextMenuOptionDisabledText =
  "Configure and select a TailSearch search term option to search by.";

export function getContextMenuOptionTitle(selectedText: string, appendText: string) {
  return `TailSearch '${selectedText} ${appendText}'`;
}

export async function updateContextMenuOption(
  id: string,
  item: Omit<Partial<chrome.contextMenus.CreateProperties>, "id">
): Promise<void> {
  await chrome.contextMenus.update(id, item);
}

export async function disableContextMenuOption(): Promise<void> {
  return updateContextMenuOption(TailsearchContextMenuOptionId, {
    title: TailsearchContextMenuOptionDisabledText,
    enabled: false
  });
}
