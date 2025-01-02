const port = chrome.runtime.connect({ name: "content-script" });

document.addEventListener("mouseup", () => {
  const selectedText = document.getSelection().toString();

  if (selectedText == null || selectedText.trim() === "") {
    return;
  }

  port.postMessage({
    type: "text-selected",
    data: { selectedText: selectedText }
  });
});

port.onDisconnect.addListener(() => {
  console.log(`Content script disconnected from ${location.href}...`);
});
