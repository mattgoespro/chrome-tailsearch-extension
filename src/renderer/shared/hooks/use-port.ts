import { useContext } from "react";
import { RuntimePortMessageEvent, RuntimePortMessageType } from "../../../shared/message-event";
import { PortContext } from "../contexts/port-context";

export function usePort() {
  const { port, source } = useContext(PortContext);

  // throw error if port is disconnected
  if (port == null) {
    throw new Error("Cannot use a disconnected port.");
  }

  function postMessage<T extends RuntimePortMessageType>(
    msg: Omit<RuntimePortMessageEvent<T>, "source">
  ) {
    port.postMessage({
      ...msg,
      source
    });
  }

  return {
    postMessage
  };
}
