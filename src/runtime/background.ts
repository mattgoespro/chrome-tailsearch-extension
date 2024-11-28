import { AppendTextStorage, AppendTextStorageKey } from "../shared/storage";

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
    chrome.storage.sync.get<AppendTextStorage>(AppendTextStorageKey, ({ appendText }) => {
      const query = `${info.selectionText} ${appendText}`;
      chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(query)}` });
    });
  }
});

// Listen for text selection in the browser page
chrome.runtime.onConnect.addListener((port) => {
  switch (port.name) {
    case "content-script": {
      port.onMessage.addListener((message) => {
        if ("selectedText" in message) {
          console.log("background script received selected text message:", message);
          chrome.storage.sync.get<AppendTextStorage>(AppendTextStorageKey, ({ appendText }) => {
            chrome.contextMenus.update("searchWithWord", {
              title: `Open '${message.selectedText} ${appendText}'`,
              enabled: true
            });
          });
        }
      });
      return;
    }
  }
});
