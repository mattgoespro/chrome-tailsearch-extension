const port = chrome.runtime.connect({ name: "content-script" });

document.addEventListener("mouseup", () => {
  const selectedText = document.getSelection().toString();

  if (selectedText == null || selectedText == "") {
    return;
  }

  port.postMessage({
    type: "text-selected",
    selectedText: selectedText
  });
});
