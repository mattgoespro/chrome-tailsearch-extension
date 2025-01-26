export const TailsearchChromeStorageKey = "tailsearch" as const;

export type TailsearchStorage = {
  pageSelectedText?: string;
  searchTerm?: string;
  options?: string[];
};

export async function getChromeStorageData(): Promise<TailsearchStorage> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (items) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve(items as TailsearchStorage);
    });
  });
}

export async function updateChromeStorageData(
  value: Partial<TailsearchStorage>
): Promise<TailsearchStorage> {
  const currentStorage = await getChromeStorageData();
  await chrome.storage.sync.set({
    ...currentStorage,
    ...value
  });

  return getChromeStorageData();
}

export type TailsearchStorageDataChange<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    oldValue: T[K];
    newValue: T[K];
  };
};
