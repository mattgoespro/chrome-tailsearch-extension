type RuntimePortMessagePayloads = {
  "content-script-text-selected": { selectedText: string };
  "set-current-search-term-option": { searchTerm: string };
  "remove-search-term-option": { searchTerm: string };
};

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
