import { RuntimePortMessageEvent } from "../../../shared/message-event";
import { getChromeStorageData, updateChromeStorageData } from "../../../shared/storage";
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

async function removeSearchTermOption(option: string) {
  const currentData = await getChromeStorageData();
  const options = currentData.searchTermOptions ?? [];
  const updatedOptions = options.filter((opt) => opt !== option);
  const updatedStorageData = await updateChromeStorageData({
    searchTermOptions: updatedOptions
  });

  if (updatedStorageData.currentSearchTermOption === option) {
    await disableContextMenuOption();
    console.warn(
      "The search term was unset from the settings page and the context menu option was disabled."
    );
  }
}

export async function onPopupPageMessageReceived(
  message: RuntimePortMessageEvent<"set-current-search-term-option" | "remove-search-term-option">
) {
  console.log(`Handling popup message: ${message.type}`);

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

export async function onContentScriptPortMessageReceived(
  message: RuntimePortMessageEvent<"content-script-context-menu-opened">
) {
  console.log(`Handling content script message: ${message.type}`);
  console.log(message);

  switch (message.type) {
    case "content-script-context-menu-opened": {
      const updatedStorageData = await updateChromeStorageData({
        pageSelectedText: message.data.selectedText
      });

      if (updatedStorageData.currentSearchTermOption == null) {
        await disableContextMenuOption();
        console.warn(
          "The search term has been unset from somewhere, so the context menu option was disabled."
        );
        return;
      }

      const menuOptionTitle = getContextMenuOptionTitle(
        updatedStorageData.pageSelectedText,
        updatedStorageData.currentSearchTermOption
      );

      await updateContextMenu(ContextMenuOptionId, {
        title: menuOptionTitle,
        enabled: true
      });

      console.log(
        `Text selection triggered a context menu option title update -> '${menuOptionTitle}'`
      );
    }
  }

  return true;
}
