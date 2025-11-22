import { RuntimePortMessageEvent } from "../../../shared/message-event";
import { removeSearchTermOption, updateStorageData } from "../../../shared/storage";
import {
  updateContextMenuOption,
  TailsearchContextMenuOptionId,
  getContextMenuOptionTitle,
  disableContextMenuOption
} from "../../components/context-menu";

async function updateExtensionStateForSearchTerm(searchTerm: string) {
  if (searchTerm == null) {
    await disableContextMenuOption();
    console.info(
      "The text to append was unset from the settings page. The context menu option has been disabled."
    );
    return;
  }

  const updatedData = await updateStorageData({
    currentSearchTermOption: searchTerm
  });

  await updateContextMenuOption(TailsearchContextMenuOptionId, {
    title: getContextMenuOptionTitle(updatedData.pageSelectedText, searchTerm),
    enabled: true
  });
}

export async function onSettingsPageMessageReceived(
  message: RuntimePortMessageEvent<"set-current-search-term-option" | "remove-search-term-option">
) {
  switch (message.type) {
    case "set-current-search-term-option": {
      await updateExtensionStateForSearchTerm(message.data.searchTerm);
      break;
    }
    case "remove-search-term-option": {
      await removeSearchTermOption(message.data.searchTerm);
      break;
    }
  }
}

export async function onPopupPageMessageReceived(
  message: RuntimePortMessageEvent<"set-current-search-term-option">
) {
  switch (message.type) {
    case "set-current-search-term-option": {
      await updateExtensionStateForSearchTerm(message.data.searchTerm);
      break;
    }
  }
}

export async function onContentScriptMessageReceived(
  message: RuntimePortMessageEvent<"content-script-context-menu-opened">,
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: unknown) => void
) {
  switch (message.type) {
    case "content-script-context-menu-opened": {
      const updatedStorageData = await updateStorageData({
        pageSelectedText: message.data.selectedText
      });

      if (updatedStorageData.currentSearchTermOption == null) {
        await disableContextMenuOption();
        console.info(
          "The current search term option is unset. The context menu option has been disabled."
        );
        return true;
      }

      const menuOptionTitle = getContextMenuOptionTitle(
        updatedStorageData.pageSelectedText,
        updatedStorageData.currentSearchTermOption
      );

      await updateContextMenuOption(TailsearchContextMenuOptionId, {
        title: menuOptionTitle,
        enabled: true
      });

      console.log(`Context menu option title updated -> '${menuOptionTitle}'`);
      break;
    }
  }
}
