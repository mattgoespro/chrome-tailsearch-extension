import {
  onContentScriptPortMessageReceived,
  onSettingsPagePortMessageReceived,
  onPopupPortMessageReceived
} from "../extension-handlers/message-handlers";

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
