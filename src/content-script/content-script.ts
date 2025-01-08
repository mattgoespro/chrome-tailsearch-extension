import { RuntimePortMessageEvent } from "../shared/message-event";

let port = chrome.runtime.connect({ name: "content-script" });

function log(script: string, ...args: unknown[]) {
  console.log(`[chrome-appended-text-search] ${script}: `, ...args);
}

document.addEventListener("mouseup", () => {
  const selectedText = document.getSelection().toString();

  if (selectedText == null || selectedText.trim() === "") {
    return;
  }

  const textSelectedMessage: RuntimePortMessageEvent<"content-script-text-selected"> = {
    type: "content-script-text-selected",
    source: "content-script",
    data: { selectedText: selectedText }
  };

  log(
    "content-script",
    `Selected text: ${selectedText}`,
    `Sending message through port ${port.name}: `,
    textSelectedMessage
  );

  port.postMessage(textSelectedMessage);
});

port.onDisconnect.addListener(() => {
  log(
    "content-script",
    `Content script disconnected from port at location '${location.href}', reconnecting...`
  );
  port = chrome.runtime.connect({ name: "content-script" });
});

window.onclose = () => {
  port.disconnect();
  log("content-script", "Content script disconnected when the window closed.");
};
