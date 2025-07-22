import { configurePort } from "./connections";

export async function onReceivedConnection(port: chrome.runtime.Port) {
  const { sender, name } = port;
  const senderTabId = sender?.tab?.id != null ? sender.tab.id.toString() : name;

  configurePort(senderTabId, port);

  return true;
}
