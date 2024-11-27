const input = document.querySelector<HTMLInputElement>("#word");
const saveButton = document.querySelector<HTMLButtonElement>("#save");
const statusMessage = document.querySelector<HTMLParagraphElement>("#status");

// Load the current word
chrome.storage.sync.get("word", ({ word }) => {
  input.value = word || "";
});

// Save the new word
saveButton.addEventListener("click", () => {
  const newWord = input.value.trim();
  if (newWord) {
    chrome.storage.sync.set({ word: newWord }, () => {
      statusMessage.textContent = "Word saved!";
      setTimeout(() => (statusMessage.textContent = ""), 2000);
    });
  }
});
