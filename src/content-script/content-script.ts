import { RuntimePortMessageEvent } from "../shared/message-event";

let port = chrome.runtime.connect({ name: "content-script" });

function log(...args: unknown[]) {
  console.log(`[chrome-appended-text-search] `, [...args, `Location: ${location.href}`].join("\n"));
}

document.addEventListener("mouseup", () => {
  const selectedText = document.getSelection().toString();

  if ((selectedText ?? "").trim().length === 0) {
    return;
  }

  const textSelectedMessage: RuntimePortMessageEvent<"content-script-text-selected"> = {
    type: "content-script-text-selected",
    source: "content-script",
    data: { selectedText }
  };

  log(
    `Selected text: ${selectedText}`,
    `Sending selected text '${textSelectedMessage}' to extension through port name ${port.name}: `
  );

  port.postMessage(textSelectedMessage);
});

port.onDisconnect.addListener(() => {
  log("Content script disconnected, reconnecting...");
  port = chrome.runtime.connect({ name: "content-script" });
});

window.onclose = () => {
  port.disconnect();
  log("Content script disconnected because the window was closed.");
};
