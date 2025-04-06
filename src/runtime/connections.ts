export const ValidConnectionNames = ["background", "settings", "popup"] as const;

export const ActiveConnections: Record<string, chrome.runtime.Port> = {};

function isSupportedConnection(name: string): name is (typeof ValidConnectionNames)[number] {
  return ValidConnectionNames.includes(name as (typeof ValidConnectionNames)[number]);
}

/**
 * Updates the connection for the given port.
 * @param connectionPort - The port to update.
 */
export function registerConnection(connectionPort: chrome.runtime.Port) {
  if (!isSupportedConnection(connectionPort.name)) {
    console.warn(`Skipping update for unsupported connection '${connectionPort.name}'`);
    return;
  }

  if (ActiveConnections[connectionPort.name] != null) {
    console.log(
      `Updating connection for port '${connectionPort.name}' from sender '${connectionPort.sender.id}'`
    );
    ActiveConnections[connectionPort.sender.id] = connectionPort;
    return;
  }

  console.log(`Adding new connection for supported port '${connectionPort.name}'`);

  ActiveConnections[connectionPort.name] = connectionPort;

  connectionPort.onDisconnect.addListener(() => {
    console.log(`Background disconnected from port '${connectionPort.name}'`);
    delete ActiveConnections[connectionPort.name];
  });
}

export function hasConnection(name: string) {
  return ActiveConnections[name] != null;
}
