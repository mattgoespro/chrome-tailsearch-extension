type RuntimePortMessagePayloads = {
  "content-script-context-menu-opened": { selectedText: string };
  "set-current-search-term-option": { searchTerm: string };
  "remove-search-term-option": { searchTerm: string };
};

export type RuntimePortMessageName = keyof RuntimePortMessagePayloads;

const RuntimePortMessageSources = ["options", "popup", "content-script"] as const;

export type RuntimePortMessageSource = (typeof RuntimePortMessageSources)[number];

export function isRuntimePort(name: string): name is RuntimePortMessageSource {
  return RuntimePortMessageSources.includes(name as RuntimePortMessageSource);
}

export type RuntimePortMessageEvent<T extends RuntimePortMessageName = RuntimePortMessageName> =
  RuntimePortMessagePayloads[T] extends undefined
    ? {
        source: RuntimePortMessageSource;
        type: T;
      }
    : { source: RuntimePortMessageSource; type: T; data: RuntimePortMessagePayloads[T] };
