import { updateChromeStorageData } from "../../../shared/storage";
import {
  onContentScriptPortMessageReceived,
  onSettingsPagePortMessageReceived,
  onPopupPortMessageReceived
} from "./message-handlers";
import { onActionClicked } from "../component-handlers/action-handler";
import {
  TailSearchContextMenuOptionId,
  TailSearchContextMenuOptionDisabledOptionLabel,
  getContextMenuOptionTitle
} from "../../components/context-menu";

export async function onInstalled() {
  const contextMenuCreateProps: chrome.contextMenus.CreateProperties = {
    id: TailSearchContextMenuOptionId,
    title: TailSearchContextMenuOptionDisabledOptionLabel,
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
}

export async function onReceivedConnection(port: chrome.runtime.Port) {
  console.log(`Background received connection from port '${port.name}'`);

  switch (port.name) {
    case "content-script":
      port.onMessage.addListener(onContentScriptPortMessageReceived);
      break;
    case "settings": {
      port.onMessage.addListener(onSettingsPagePortMessageReceived);
      break;
    }
    case "popup":
      port.onMessage.addListener(onPopupPortMessageReceived);
      break;
    default:
      console.warn(`Unknown port '${port.name}'!`);
      break;
  }
}
