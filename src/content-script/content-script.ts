import { RuntimePortMessageEvent } from "../shared/message-event";

console.log("Loaded content script");

function log(...args: unknown[]) {
  console.log(`[chrome-appended-text-search] `, [...args, `Location: ${location.href}`].join("\n"));
}

chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
  log(`Content script connected to port: ${port.name}`);

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

    log(
      `Selected text: ${selectedText}`,
      `Sending message through port ${port.name}: `,
      textSelectedMessage
    );

    port.postMessage(textSelectedMessage);
  });

  return;
});
