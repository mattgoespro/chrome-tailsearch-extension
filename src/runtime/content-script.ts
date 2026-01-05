import { RuntimePortMessageEvent } from "../shared/message-event";

document.addEventListener("mouseup", () => {
  const selectedText = document.getSelection().toString();

  if ((selectedText ?? "").trim().length === 0) {
    return;
  }

  chrome.runtime.sendMessage(
    <RuntimePortMessageEvent<"content-script-context-menu-opened">>{
      type: "content-script-context-menu-opened",
      source: "content-script",
      data: { selectedText }
    },
    () => {
      if (chrome.runtime.lastError) {
        console.warn(
          "Content script failed to send message to background: ",
          chrome.runtime.lastError.message
        );
        return;
      }
    }
  );
});

document.addEventListener("contextmenu", () => {
  const selectedText = document.getSelection().toString();

  if ((selectedText ?? "").trim().length === 0) {
    return;
  }

  chrome.runtime.sendMessage(
    <RuntimePortMessageEvent<"content-script-context-menu-opened">>{
      type: "content-script-context-menu-opened",
      source: "content-script",
      data: { selectedText }
    },
    (a) => {
      if (chrome.runtime.lastError) {
        console.warn(
          "Content script failed to send message to background: ",
          chrome.runtime.lastError.message
        );
        return;
      }
    }
  );
});
