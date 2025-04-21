import { RuntimePortMessageEvent } from "../../shared/message-event";
import { getChromeStorageData, updateChromeStorageData } from "../../shared/storage";
import {
  updateContextMenu,
  ContextMenuOptionId,
  getContextMenuOptionTitle,
  ContextMenuOptionDisabledOptionLabel
} from "../context-menu";

async function updateExtensionStateForSearchTerm(searchTerm: string) {
  if (searchTerm == null) {
    await updateContextMenu(ContextMenuOptionId, {
      title: ContextMenuOptionDisabledOptionLabel,
      enabled: false
    });
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

export async function onSettingsPagePortMessageReceived(
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
      const currentData = await getChromeStorageData();
      const options = currentData.searchTermOptions ?? [];
      const updatedOptions = options.filter((option) => option !== message.data.searchTerm);
      const updatedStorageData = await updateChromeStorageData({
        searchTermOptions: updatedOptions
      });
      console.log("Updated extension state for search term options:", updatedStorageData);
      if (updatedStorageData.currentSearchTermOption === message.data.searchTerm) {
        await updateContextMenu(ContextMenuOptionId, {
          title: ContextMenuOptionDisabledOptionLabel,
          enabled: false
        });
        console.warn("The search term was unset, disabling context menu option.");
      }
      break;
    }
  }
}

export async function onPopupPortMessageReceived(
  message: RuntimePortMessageEvent<"set-current-search-term-option">
) {
  console.log(`Handling popup message: ${message.type}`);

  switch (message.type) {
    case "set-current-search-term-option": {
      await updateExtensionStateForSearchTerm(message.data.searchTerm);
      console.log("Updated extension state for search term:", message.data.searchTerm);
      break;
    }
  }
}

export async function onContentScriptPortMessageReceived(
  message: RuntimePortMessageEvent<"content-script-text-selected">
) {
  console.log(`Handling content script message: ${message.type}`);
  console.log(message);

  switch (message.type) {
    case "content-script-text-selected": {
      const updatedStorageData = await updateChromeStorageData({
        pageSelectedText: message.data.selectedText
      });

      if (updatedStorageData.currentSearchTermOption == null) {
        await updateContextMenu(ContextMenuOptionId, {
          title: ContextMenuOptionDisabledOptionLabel,
          enabled: false
        });
        console.warn("The search term was unset, disabling context menu option.");
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
}
