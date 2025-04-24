import { getChromeStorageData } from "../../../shared/storage";
import { createTailSearchQueryUrl } from "../../../shared/tailsearch";
import { TailSearchContextMenuOptionId } from "../../components/context-menu";

export async function onContextMenuOptionClicked({
  menuItemId,
  selectionText
}: chrome.contextMenus.OnClickData) {
  console.log("Context menu option clicked:", menuItemId, selectionText);
  switch (menuItemId) {
    case TailSearchContextMenuOptionId: {
      const { currentSearchTermOption, pageSelectedText } = await getChromeStorageData();

      if (pageSelectedText !== selectionText) {
        throw new Error(
          "The selected text does not match the text used to create the context menu option, aborting."
        );
      }

      if (selectionText != null) {
        chrome.tabs.create({
          url: createTailSearchQueryUrl(selectionText, currentSearchTermOption)
        });
      }
    }
    default: {
      console.warn(`Ignoring context menu option click for unknown menu item: ${menuItemId}`);
      break;
    }
  }

  return true;
}
