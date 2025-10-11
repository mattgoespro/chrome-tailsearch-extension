import { RuntimePortMessageEvent } from "../../../shared/message-event";
import { removeSearchTermOption, updateChromeStorageData } from "../../../shared/storage";
import {
  updateContextMenu,
  ContextMenuOptionId,
  getContextMenuOptionTitle,
  disableContextMenuOption
} from "../../components/context-menu";

async function updateExtensionStateForSearchTerm(searchTerm: string) {
  if (searchTerm == null) {
    await disableContextMenuOption();
    console.warn(
      "The text to append was unset from the settings page, disabling context menu option."
    );
    return;
  }

  const updatedData = await updateChromeStorageData({
    currentSearchTermOption: searchTerm
  });

  await updateContextMenu(ContextMenuOptionId, {
    title: getContextMenuOptionTitle(updatedData.pageSelectedText, searchTerm),
    enabled: true
  });
}

export async function onSettingsPageMessageReceived(
  message: RuntimePortMessageEvent<"set-current-search-term-option" | "remove-search-term-option">
) {
  console.log(`Handling setting page message: ${message.type}`);

  switch (message.type) {
    case "set-current-search-term-option": {
      await updateExtensionStateForSearchTerm(message.data.searchTerm);
      console.log("Updated extension state for search term:", message.data.searchTerm);
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
  console.log(`Handling popup message: ${message.type}`);

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
      const msg = message;
      const updatedStorageData = await updateChromeStorageData({
        pageSelectedText: msg.data.selectedText
      });

      if (updatedStorageData.currentSearchTermOption == null) {
        await disableContextMenuOption();
        console.warn(
          "The search term has been unset from somewhere, so the context menu option was disabled."
        );
        return true;
      }

      const menuOptionTitle = getContextMenuOptionTitle(
        updatedStorageData.pageSelectedText,
        updatedStorageData.currentSearchTermOption
      );

      await updateContextMenu(ContextMenuOptionId, {
        title: menuOptionTitle,
        enabled: true
      });

      console.log(`Context menu option title changed -> '${menuOptionTitle}'`);
      break;
    }
    default: {
      throw new Error(`Unhandled content script message type: ${message.type}`);
    }
  }
}
