type RuntimePortMessagePayloads = {
  "content-script-text-selected": { selectedText: string };
  "popup-update-search-term": { searchTerm: string };
  "settings-update-search-term": { searchTerm: string };
};

export type RuntimePortMessageName = keyof RuntimePortMessagePayloads;

const RuntimePortMessageSources = ["content-script", "settings", "popup"] as const;

export type RuntimePortMessageSource = (typeof RuntimePortMessageSources)[number];

export type RuntimePortMessageType = keyof RuntimePortMessagePayloads;

export function isRuntimePort(name: string): name is RuntimePortMessageType {
  return RuntimePortMessageSources.includes(name as RuntimePortMessageSource);
}

export type RuntimePortMessageEvent<T extends RuntimePortMessageType = RuntimePortMessageType> =
  RuntimePortMessagePayloads[T] extends undefined
    ? {
        source: RuntimePortMessageSource;
        type: T;
      }
    : { source: RuntimePortMessageSource; type: T; data: RuntimePortMessagePayloads[T] };
