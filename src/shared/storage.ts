export const AppendTextStorageKey = "appendText";

export type AppendTextStorage = {
  selectedText?: string;
  appendText?: string;
};

export async function getStorage(): Promise<AppendTextStorage> {
  return chrome.storage.sync.get<AppendTextStorage>(AppendTextStorageKey);
}

export async function updateStorage(value: AppendTextStorage): Promise<void> {
  const storage = await getStorage();
  return chrome.storage.sync.set({ ...storage, ...value });
}

export type StorageChangeValue<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    oldValue: T[K];
    newValue: T[K];
  };
};
