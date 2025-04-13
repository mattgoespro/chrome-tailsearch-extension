import { registerConnection } from "../../connections";
import {
  onSettingsPageSenderMessageReceived,
  onPopupSenderMessageReceived
} from "./message-handlers";

/**
 * Manages connections to the background script are made from the popup and settings page.
 * @param port
 */

export async function onBackgroundReceivedConnection(port: chrome.runtime.Port) {
  console.log(`Background received connection from port '${port.name}'`);

  registerConnection(port.name, port);

  switch (port.name) {
    case "settings": {
      port.onMessage.addListener(onSettingsPageSenderMessageReceived);
      break;
    }
    case "popup":
      port.onMessage.addListener(onPopupSenderMessageReceived);
      break;
    default:
      console.warn(`Received unsupported connection '${port.name}'`);
      break;
  }
}
