declare namespace chrome {
  interface Window {
    chrome: typeof chrome;
  }

  namespace events {
    type Event<T extends (...args: any[]) => any> = {
      addListener: (callback: T) => void;
      removeListener: (callback: T) => void;
    };
  }

  export type EventCallbackArguments<T> =
    T extends chrome.events.Event<infer EventFnParams>
      ? EventFnParams extends (...args: infer Args) => unknown
        ? Args
        : never
      : never;
}

export {};
