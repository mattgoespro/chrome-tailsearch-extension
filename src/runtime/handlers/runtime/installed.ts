import { updateChromeStorageData } from "../../../shared/storage";
import {
  ContextMenuOptionId,
  ContextMenuOptionDisabledOptionLabel,
  getContextMenuOptionTitle
} from "../../components/context-menu";

export async function onInstalled() {
  const contextMenuCreateProps: chrome.contextMenus.CreateProperties = {
    id: ContextMenuOptionId,
    title: ContextMenuOptionDisabledOptionLabel,
    enabled: false,
    contexts: ["selection"]
  };

  // Set default sync storage data on install
  const { EXTENSION_STORAGE_INITIAL_DATA } = process.env;

  if (EXTENSION_STORAGE_INITIAL_DATA != null) {
    const initialData = JSON.parse(EXTENSION_STORAGE_INITIAL_DATA);

    await updateChromeStorageData(initialData);

    contextMenuCreateProps.enabled = true;
    contextMenuCreateProps.title = getContextMenuOptionTitle("", initialData.appendedText);
  }

  chrome.contextMenus.create(contextMenuCreateProps);
}
