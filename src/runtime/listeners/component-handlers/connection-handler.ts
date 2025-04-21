import {
  onContentScriptPortMessageReceived,
  onSettingsPageMessageReceived,
  onPopupPageMessageReceived
} from "../extension-handlers/message-handlers";

export async function onReceivedConnection(port: chrome.runtime.Port) {
  console.log(`Background received connection from port '${port.name}'`);

  switch (port.name) {
    case "content-script":
      port.onMessage.addListener(onContentScriptPortMessageReceived);
      break;
    case "options": {
      port.onMessage.addListener(onSettingsPageMessageReceived);
      break;
    }
    case "popup":
      port.onMessage.addListener(onPopupPageMessageReceived);
      break;
    default:
      console.warn(`Unknown port '${port.name}'!`);
      break;
  }
}
