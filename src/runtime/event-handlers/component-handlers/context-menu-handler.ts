import { getStorageData } from "../../../shared/storage";
import { createTailSearchQueryUrl } from "../../../shared/model";
import { TailsearchContextMenuOptionId } from "../../components/context-menu";

export async function onContextMenuOptionClicked({
  menuItemId,
  selectionText
}: chrome.contextMenus.OnClickData) {
  switch (menuItemId) {
    case TailsearchContextMenuOptionId: {
      const { currentSearchTermOption } = await getStorageData();

      console.log("Text used to open context menu option:", selectionText);

      if ((selectionText ?? "").trim().length > 0) {
        await chrome.tabs.create({
          url: createTailSearchQueryUrl(selectionText, currentSearchTermOption)
        });
      }
    }
    default: {
      console.warn(`Ignoring context menu option click for unknown option: ${menuItemId}`);
      break;
    }
  }

  return true;
}
