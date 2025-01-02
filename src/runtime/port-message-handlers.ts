import { RuntimePortMessageEvent } from "../shared/message-event";
import { updateStorage, getStorage } from "../shared/storage";
import { updateContextMenu, ContextMenuOptionId, getContextMenuOptionTitle } from "./context-menu";

export async function onRuntimePortMessageReceived(
  message: RuntimePortMessageEvent<"text-selected" | "update-context-menu">
) {
  console.log(`Received message from ${message.type}...`);
  console.log(message);

  switch (message.type) {
    case "text-selected": {
      const { appendText, selectedText } = await updateStorage({
        selectedText: message.data.selectedText
      });
      await updateContextMenu(ContextMenuOptionId, {
        title: getContextMenuOptionTitle(message.data.selectedText, appendText),
        enabled: true
      });
      break;
    }
    case "update-context-menu": {
      const { appendText, selectedText } = await getStorage();

      if (appendText == null) {
        await updateContextMenu(ContextMenuOptionId, {
          title: "Configure the text to append from the extension options.",
          enabled: false
        });
        return;
      }

      await updateContextMenu(ContextMenuOptionId, {
        title: `Google appended selection '${selectedText} ${appendText}'`,
        enabled: true
      });
    }
  }
}
