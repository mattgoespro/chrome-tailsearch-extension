import { useContext } from "react";
import { RuntimePortMessageEvent, RuntimePortMessageType } from "../../../shared/message-event";
import { PortContext } from "../contexts/port-context";

export function usePort() {
  const port = useContext(PortContext);

  // throw error if port is disconnected
  if (port == null) {
    throw new Error("Port is not connected");
  }

  function postMessage<T extends RuntimePortMessageType>(msg: RuntimePortMessageEvent<T>) {
    port.postMessage(msg);
  }

  return {
    postMessage
  };
}
