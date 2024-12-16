import { RuntimePortMessageEvent } from "../shared/message-event";
import { updateStorage, getStorage } from "../shared/storage";
import { updateContextMenu, ContextMenuOptionId } from "./context-menu";

export async function onRuntimePortMessageReceived(
  message: RuntimePortMessageEvent<"text-selected" | "update-context-menu">
) {
  switch (message.type) {
    case "text-selected": {
      await updateStorage({ selectedText: message.data.selectedText });
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
        title: `Search Google for '${selectedText} ${appendText}'`,
        enabled: true
      });
    }
  }
}
