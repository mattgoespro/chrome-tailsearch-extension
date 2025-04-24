type RuntimePortMessagePayloads = {
  "content-script-context-menu-opened": { selectedText: string };
  "set-current-search-term-option": { searchTerm: string };
  "remove-search-term-option": { searchTerm: string };
};

export const RuntimePortMessageSources = ["content-script", "options", "popup"] as const;

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
