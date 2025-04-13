import { getChromeStorageData } from "../../../shared/storage";
import {
  updateContextMenu,
  ContextMenuOptionId,
  ContextMenuOptionDisabledOptionLabel
} from "../../components/context-menu";

export async function onContextMenuOptionClicked({
  menuItemId,
  selectionText
}: chrome.contextMenus.OnClickData) {
  const { searchTerm: appendText } = await getChromeStorageData();

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
