import { updateChromeStorageData } from "../../../shared/storage";
import { onActionClicked } from "../component-handlers/action-handler";
import {
  ContextMenuOptionId,
  ContextMenuOptionDisabledText,
  getContextMenuOptionTitle
} from "../../components/context-menu";

export async function onInstalled() {
  const contextMenuCreateProps: chrome.contextMenus.CreateProperties = {
    id: ContextMenuOptionId,
    title: ContextMenuOptionDisabledText,
    enabled: false,
    contexts: ["selection"]
  };

  /**
   * When debugging, store the initial data from the environment in sync storage.
   */
  const { EXTENSION_STORAGE_INITIAL_DATA } = process.env;

  if (EXTENSION_STORAGE_INITIAL_DATA != null) {
    const initialData = { ...JSON.parse(EXTENSION_STORAGE_INITIAL_DATA) };

    await updateChromeStorageData(initialData);

    contextMenuCreateProps.enabled = true;
    contextMenuCreateProps.title = getContextMenuOptionTitle("", initialData.appendedText);
  }

  chrome.contextMenus.create(contextMenuCreateProps);

  chrome.action.onClicked.addListener(onActionClicked);

  return true;
}
