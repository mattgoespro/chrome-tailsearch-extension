import { RuntimePortMessageEvent } from "../shared/message-event";

console.log("Loaded content script");

/**
 * Runs when the background script connects to the this script using `chrome.tabs.connect`.
 */
chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
  console.log(`Content script connected to background through port: ${port.name}`);

  document.addEventListener("mouseup", () => {
    const selectedText = document.getSelection().toString();

    if ((selectedText ?? "").trim().length === 0) {
      return;
    }

    const textSelectedMessage: RuntimePortMessageEvent<"content-script-text-selected"> = {
      type: "content-script-text-selected",
      source: "content-script",
      data: { selectedText: selectedText }
    };

    console.log(`Sending selected text to background: ${selectedText}`);

    port.postMessage(textSelectedMessage);
  });

  return;
});
