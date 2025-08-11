import { RuntimePortMessageEvent } from "../shared/message-event";

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

  chrome.runtime.sendMessage(textSelectedMessage, (response) => {
    if (chrome.runtime.lastError) {
      // This happens if background is missing or extension is reloaded
      console.warn("Failed to send message to background:", chrome.runtime.lastError.message);
      return;
    }
    // Optional: handle background's response
    console.log("Background responded:", response);
  });
});

document.addEventListener("contextmenu", (event) => {
  console.log("Detected context menu event", event);
  const selectedText = document.getSelection().toString();

  if ((selectedText ?? "").trim().length === 0) {
    return;
  }

  const contextMenuMessage: RuntimePortMessageEvent<"content-script-context-menu-opened"> = {
    type: "content-script-context-menu-opened",
    source: "content-script",
    data: { selectedText }
  };

  chrome.runtime.sendMessage(contextMenuMessage, (response) => {
    if (chrome.runtime.lastError) {
      // This happens if background is missing or extension is reloaded
      console.warn("Failed to send message to background:", chrome.runtime.lastError.message);
      return;
    }
    // Optional: handle background's response
    console.log("Background responded:", response);
  });
});
