import { RuntimePortMessageEvent } from "../../shared/message-event";
import { updateStorage, getStorage } from "../../shared/storage";
import {
  updateContextMenu,
  ContextMenuOptionId,
  getContextMenuOptionTitle,
  ContextMenuOptionDisabledOptionLabel
} from "../context-menu";

export async function onSettingsPagePortMessageReceived(
  message: RuntimePortMessageEvent<"settings-update-context-menu">
) {
  console.log(`Handling setting page message: ${message.type}`);
  // console.log(message);

  const { appendText, selectedText } = await getStorage();

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

export async function onContentScriptPortMessageReceived(
  message: RuntimePortMessageEvent<"content-script-text-selected">
) {
  console.log(`Handling content script message: ${message.type}`);
  console.log(message);

  const updatedStorageData = await updateStorage({
    selectedText: message.data.selectedText
  });
  console.log("Updated storage:", updatedStorageData);

  if (updatedStorageData.appendText == null) {
    await updateContextMenu(ContextMenuOptionId, {
      title: ContextMenuOptionDisabledOptionLabel,
      enabled: false
    });
    console.warn("The text to append was unset, disabling context menu option.");
    return;
  }

  const menuOptionTitle = getContextMenuOptionTitle(
    updatedStorageData.selectedText,
    updatedStorageData.appendText
  );

  await updateContextMenu(ContextMenuOptionId, {
    title: menuOptionTitle,
    enabled: true
  });

  console.log(
    `Text selection triggered a context menu option title update -> '${menuOptionTitle}'`
  );
}
