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

  const connectionName = connectionPort.name;

  if (ActiveConnections[connectionName] != null) {
    console.log(
      `Updating connection for port '${connectionName}' from sender '${connectionPort.sender?.id ?? "unknown"}'`
    );
    ActiveConnections[connectionName] = connectionPort;
    return;
  }

  console.log(`Adding new connection for supported port '${connectionName}'`);

  ActiveConnections[connectionName] = connectionPort;

  connectionPort.onDisconnect.addListener(() => {
    console.log(`Background disconnected from port '${connectionName}'`);
    delete ActiveConnections[connectionPort.name];
  });
}

export function hasConnection(name: string) {
  return ActiveConnections[name] != null;
}
