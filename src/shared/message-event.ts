type RuntimePortMessagePayloads = {
  "content-script-text-selected": { selectedText: string };
  "settings-update-context-menu": undefined;
};
type RuntimePortMessageSource = "content-script" | "settings";

export type RuntimePortMessageType = keyof RuntimePortMessagePayloads;

export type RuntimePortMessageEvent<T extends RuntimePortMessageType = RuntimePortMessageType> =
  RuntimePortMessagePayloads[T] extends undefined
    ? {
        source: RuntimePortMessageSource;
        type: T;
      }
    : { source: RuntimePortMessageSource; type: T; data: RuntimePortMessagePayloads[T] };
