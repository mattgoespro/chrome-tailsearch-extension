import { getChromeStorageData } from "../../../shared/storage";

export async function onActionClicked(tab: chrome.tabs.Tab) {
  const { searchTerm: appendText, pageSelectedText: selectedText } = await getChromeStorageData();

  const searchTerm = [selectedText, appendText].join(" ");

  if (appendText == null) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      injectImmediately: true,
      func: () => {
        alert("You haven't configured the text to append from the extension options.");
      }
    });
    return;
  }

  await chrome.tabs.create({
    url: `https://www.google.com/search?q=${encodeURIComponent(`${selectedText} ${appendText}`)}`,
    active: false
  });
  console.log(`Opened new tab with search query '${searchTerm}'`);
}
