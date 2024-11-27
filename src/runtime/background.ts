chrome.runtime.onInstalled.addListener(() => {
  // Default word on install
  chrome.storage.sync.set({ word: "example" });

  chrome.contextMenus.create({
    id: "searchWithWord",
    title: "Open '<highlighted_text> <word>'",
    enabled: false,
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "searchWithWord" && info.selectionText) {
    chrome.storage.sync.get("word", ({ word }) => {
      const query = `${info.selectionText} ${word}`;
      chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(query)}` });
    });
  }
});

// Listen for text selection in the browser page
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "content-script") {
    port.onMessage.addListener((message) => {
      if ("selectedText" in message) {
        console.log("background script received selected text message:", message);
        chrome.storage.sync.get("word", ({ word }) => {
          chrome.contextMenus.update("searchWithWord", {
            title: `Open '${message.selectedText} ${word}'`
          });
        });
      }
    });
  }
});
