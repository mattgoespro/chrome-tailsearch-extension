import { getChromeStorageData } from "../../../shared/storage";
import { TailSearchContextMenuOptionId } from "../../components/context-menu";

export async function onContextMenuOptionClicked({
  menuItemId,
  selectionText
}: chrome.contextMenus.OnClickData) {
  console.log("Context menu option clicked:", menuItemId, selectionText);
  switch (menuItemId) {
    case TailSearchContextMenuOptionId: {
      const { currentSearchTermOption, pageSelectedText } = await getChromeStorageData();

      // if (currentSearchTermOption == null) {
      //   console.warn(
      //     "A search term option is not configured and the context menu option was disabled."
      //   );
      //   await disableContextMenuOption();
      //   return;
      // }

      if (pageSelectedText !== selectionText) {
        console.warn(
          "The selected text does not match the text used to create the context menu option, aborting."
        );
        return;
      }

      if (selectionText != null) {
        chrome.tabs.create({
          url: `https://www.google.com/search?q=${encodeURIComponent(`${selectionText} ${currentSearchTermOption}`)}`
        });
      }
    }
    default: {
      console.warn(`Ignoring context menu option click for unknown menu item: ${menuItemId}`);
      break;
    }
  }
}
