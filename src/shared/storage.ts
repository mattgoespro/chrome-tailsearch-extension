export const AppendTextStorageKey = "appendText";

export type AppendTextStorage = {
  selectedText?: string;
  appendText?: string;
};

export async function getStorage(): Promise<AppendTextStorage> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (items) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve(items as AppendTextStorage);
    });
  });
}

export async function updateStorage(value: Partial<AppendTextStorage>): Promise<AppendTextStorage> {
  const currentStorage = await getStorage();
  await chrome.storage.sync.set({
    ...currentStorage,
    ...value
  });

  return getStorage();
}

export type StorageChangeValue<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    oldValue: T[K];
    newValue: T[K];
  };
};
