import { disableContextMenuOption } from "../runtime/components/context-menu";

export const TailsearchChromeStorageKey = "tailsearch" as const;

export type TailsearchStorage = {
  pageSelectedText?: string;
  currentSearchTermOption?: string;
  searchTermOptions?: string[];
};

export async function getChromeStorageData(): Promise<TailsearchStorage> {
  return chrome.storage.sync.get<TailsearchStorage>();
}

export async function updateChromeStorageData(
  value: Partial<TailsearchStorage>
): Promise<TailsearchStorage> {
  await chrome.storage.sync.set<TailsearchStorage>({ ...value });
  return getChromeStorageData();
}

export async function removeSearchTermOption(option: string) {
  const currentData = await getChromeStorageData();
  const options = currentData.searchTermOptions ?? [];
  const updatedOptions = options.filter((opt) => opt !== option);
  const updatedStorageData = await updateChromeStorageData({
    searchTermOptions: updatedOptions
  });

  if (updatedStorageData.currentSearchTermOption === option) {
    await disableContextMenuOption();
    console.warn(
      "The search term was unset from the settings page and the context menu option was disabled."
    );
  }
}
