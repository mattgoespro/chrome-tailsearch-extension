export const AppendTextStorageKey = "appendText";

export type AppendTextStorage = {
  selectedText?: string;
  appendText?: string;
};

export async function getStorage(): Promise<AppendTextStorage> {
  return chrome.storage.sync.get<AppendTextStorage>(AppendTextStorageKey);
}

export async function updateStorage(value: Partial<AppendTextStorage>): Promise<AppendTextStorage> {
  const storage = await getStorage();

  await chrome.storage.sync.set(value);

  return getStorage();
}

export type StorageChangeValue<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    oldValue: T[K];
    newValue: T[K];
  };
};
