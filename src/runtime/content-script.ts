import { RuntimePortMessageEvent } from "../shared/message-event";

const port = chrome.runtime.connect({ name: "content-script" });

document.addEventListener("mouseup", () => {
  const selectedText = document.getSelection().toString();

  if ((selectedText ?? "").trim().length === 0) {
    return;
  }

  const textSelectedMessage: RuntimePortMessageEvent<"content-script-context-menu-opened"> = {
    type: "content-script-context-menu-opened",
    source: "content-script",
    data: { selectedText }
  };

  console.log("Sending message from content script:", textSelectedMessage);

  port.postMessage(textSelectedMessage);
});
