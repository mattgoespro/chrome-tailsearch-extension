import { RuntimePortMessageEvent } from "../../../shared/message-event";
import { updateChromeStorageData, getChromeStorageData } from "../../../shared/storage";
import {
  updateContextMenu,
  ContextMenuOptionId,
  getContextMenuOptionTitle,
  ContextMenuOptionDisabledOptionLabel
} from "../../components/context-menu";

export async function onSettingsPageSenderMessageReceived(
  message: RuntimePortMessageEvent<"settings-update-context-menu">
) {
  console.log(`Handling setting page message: ${message.type}`);
  const { searchTerm: appendText, pageSelectedText: selectedText } = await getChromeStorageData();

  if (appendText == null) {
    await updateContextMenu(ContextMenuOptionId, {
      title: ContextMenuOptionDisabledOptionLabel,
      enabled: false
    });
    console.warn(
      "The text to append was unset from the settings page, disabling context menu option."
    );
    return;
  }

  const menuOptionTitle = getContextMenuOptionTitle(selectedText, appendText);

  await updateContextMenu(ContextMenuOptionId, {
    title: menuOptionTitle,
    enabled: true
  });

  console.log(
    `Settings change triggered a context menu option title update -> '${menuOptionTitle}'`
  );
}

export async function onPopupSenderMessageReceived(
  message: RuntimePortMessageEvent<"popup-update-append-text-option">
) {
  console.log(`Handling popup message: ${message.type}`);

  const selectedOption = message.data.appendText;

  const newStorageData = await updateChromeStorageData({ searchTerm: selectedOption });
  console.log(`Popup append text option change triggered a storage data update`, newStorageData);
}

export async function onContentScriptSenderMessageReceived(
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
