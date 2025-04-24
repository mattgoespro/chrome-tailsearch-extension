import { getChromeStorageData } from "../../../shared/storage";
import { createTailSearchQueryUrl } from "../../../shared/tailsearch";

export async function onActionClicked(tab: chrome.tabs.Tab) {
  const { currentSearchTermOption: appendText, pageSelectedText: selectedText } =
    await getChromeStorageData();

  const searchTerm = [selectedText, appendText].join(" ");

  if (appendText == null) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      injectImmediately: true,
      func: () => {
        alert("You haven't configured the text to append from the extension options.");
      }
    });
  }

  await chrome.tabs.create({
    url: createTailSearchQueryUrl(selectedText, appendText),
    active: false
  });

  console.log(`Opened new tab with search query '${searchTerm}'`);

  return true;
}
