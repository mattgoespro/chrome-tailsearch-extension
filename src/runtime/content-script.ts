import { RuntimePortMessageEvent } from "../shared/message-event";

const port = chrome.runtime.connect({ name: "content-script" });
console.log("Connected content script to background service worker.");

// Handle disconnect properly to prevent console error from bfcache unload
port.onDisconnect.addListener(() => {
  if (chrome.runtime.lastError) {
    const msg = chrome.runtime.lastError.message;
    console.warn("Communication with content script ended:", msg);

    if (msg.includes("back/forward cache")) {
      // Page is moved to bfcache, expected behavior.
      return;
    }
  }
  // Handle other reasons for disconnection if needed.
});

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
