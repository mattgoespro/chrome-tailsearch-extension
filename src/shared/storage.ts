export const TailsearchChromeStorageKey = "tailsearch" as const;

export type TailsearchStorage = {
  pageSelectedText?: string;
  searchTerm?: string;
  options?: string[];
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
