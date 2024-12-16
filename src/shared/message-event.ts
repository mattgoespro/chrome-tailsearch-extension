type RuntimePortMessageType = "text-selected" | "update-context-menu";

type RuntimePortMessagePayloads = {
  "text-selected": { selectedText: string };
  "update-context-menu": undefined;
};

export type RuntimePortMessageEvent<T extends RuntimePortMessageType = RuntimePortMessageType> =
  RuntimePortMessagePayloads[T] extends undefined
    ? {
        type: T;
      }
    : { type: T; data: RuntimePortMessagePayloads[T] };
