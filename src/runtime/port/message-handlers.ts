import { RuntimePortMessageEvent } from "../../shared/message-event";
import { updateChromeStorageData, getChromeStorageData } from "../../shared/storage";
import {
  updateContextMenu,
  ContextMenuOptionId,
  getContextMenuOptionTitle,
  ContextMenuOptionDisabledOptionLabel
} from "../context-menu";

export async function onSettingsPagePortMessageReceived(
  message: RuntimePortMessageEvent<"settings-update-search-term">
) {
  console.log(`Handling setting page message: ${message.type}`);

  switch (message.type) {
    case "settings-update-search-term": {
      const { searchTerm } = message.data;

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

      const { pageSelectedText } = await getChromeStorageData();

      const menuOptionTitle = getContextMenuOptionTitle(pageSelectedText, searchTerm);

      await updateContextMenu(ContextMenuOptionId, {
        title: menuOptionTitle,
        enabled: true
      });

      console.log(
        `Settings change triggered a context menu option title update -> '${menuOptionTitle}'`
      );
    }
  }
}

export async function onPopupPortMessageReceived(
  message: RuntimePortMessageEvent<"popup-update-search-term">
) {
  console.log(`Handling popup message: ${message.type}`);

  switch (message.type) {
    case "popup-update-search-term": {
      const newStorageData = await updateChromeStorageData({ searchTerm: message.data.searchTerm });

      console.log(
        `Popup search term option change triggered a storage data update`,
        newStorageData
      );
    }
  }
}

export async function onContentScriptPortMessageReceived(
  message: RuntimePortMessageEvent<"content-script-text-selected">
) {
  console.log(`Handling content script message: ${message.type}`);
  console.log(message);

  const updatedStorageData = await updateChromeStorageData({
    pageSelectedText: message.data.selectedText
  });
  console.log("Updated storage:", updatedStorageData);

  if (updatedStorageData.searchTerm == null) {
    await updateContextMenu(ContextMenuOptionId, {
      title: ContextMenuOptionDisabledOptionLabel,
      enabled: false
    });
    console.warn("The text to append was unset, disabling context menu option.");
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
