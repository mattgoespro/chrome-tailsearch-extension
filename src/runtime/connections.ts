export const ExtensionConnectionNames = ["settings", "popup"] as const;

export const Connections: Record<string, chrome.runtime.Port> = {};

/**
 * Creates a connection ID from the active tab information, which is a
 * combination of the window ID and tab ID in the case that multiple windows
 * are open.
 *
 * @param activeInfo - The active tab information.
 * @returns The connection ID.
 */
export function createConnectionId(activeInfo: chrome.tabs.TabActiveInfo) {
  return `${activeInfo.windowId}-${activeInfo.tabId}`;
}

/**
 * Updates the connection for the given port.
 * @param connectionPort - The port to update.
 */
export function registerConnection(id: string, connection: chrome.runtime.Port) {
  const existingConnection = Connections[id];

  if (existingConnection != null) {
    Connections[id] = connection;
    console.log(`Updated connection for connection ID '${id}'.`);
    return;
  }

  console.log(`Adding new connection for ID '${id}'`);

  Connections[id] = connection;

  connection.onDisconnect.addListener(() => {
    console.log(`Connection ID '${id}' closed.`);
    delete Connections[id];
  });
}

export function hasConnection(id: string) {
  return Connections[id] != null;
}
