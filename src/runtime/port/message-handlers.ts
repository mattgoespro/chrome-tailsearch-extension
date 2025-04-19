import { RuntimePortMessageEvent } from "../../shared/message-event";
import { updateChromeStorageData } from "../../shared/storage";
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
    searchTerm
  });

  await updateContextMenu(ContextMenuOptionId, {
    title: getContextMenuOptionTitle(updatedData.pageSelectedText, searchTerm),
    enabled: true
  });
}

export async function onSettingsPagePortMessageReceived(
  message: RuntimePortMessageEvent<"update-search-term-storage">
) {
  console.log(`Handling setting page message: ${message.type}`);

  switch (message.type) {
    case "update-search-term-storage": {
      await updateExtensionStateForSearchTerm(message.data.searchTerm);
      console.log("Updated extension state for search term:", message.data.searchTerm);
    }
  }
}

export async function onPopupPortMessageReceived(
  message: RuntimePortMessageEvent<"update-search-term-storage">
) {
  console.log(`Handling popup message: ${message.type}`);

  switch (message.type) {
    case "update-search-term-storage": {
      await updateExtensionStateForSearchTerm(message.data.searchTerm);
      console.log("Updated extension state for search term:", message.data.searchTerm);
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

      if (updatedStorageData.searchTerm == null) {
        await updateContextMenu(ContextMenuOptionId, {
          title: ContextMenuOptionDisabledOptionLabel,
          enabled: false
        });
        console.warn("The search term was unset, disabling context menu option.");
        return;
      }

      const menuOptionTitle = getContextMenuOptionTitle(
        updatedStorageData.pageSelectedText,
        updatedStorageData.searchTerm
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
