import { AppendTextOptions } from "./append-text-options/append-text-options";
import * as styles from "./popup.module.scss";
import { AppendTextStorage, AppendTextStorageKey, getStorage } from "../../../shared/storage";
import { useQuery } from "react-query";
import { useCallback } from "react";
import { RuntimePortMessageEvent } from "../../../shared/message-event";

type ActionPopupProps = {
  commPort: chrome.runtime.Port;
};

export function ActionPopup(props: ActionPopupProps) {
  const { data, isLoading, error } = useQuery<AppendTextStorage, Error, AppendTextStorage>(
    AppendTextStorageKey,
    {
      queryFn: async () => {
        const { appendText, appendTextOptions } = await getStorage();
        return {
          appendText,
          appendTextOptions
        };
      }
    }
  );

  const handleOptionSelectionChange = useCallback((option: string) => {
    const msg: RuntimePortMessageEvent<"popup-update-append-text-option"> = {
      source: "popup",
      type: "popup-update-append-text-option",
      data: {
        appendText: option
      }
    };
    props.commPort.postMessage(msg);
  }, []);

  return (
    <div className={styles["popup"]}>
      <div className={styles["heading"]}>Appended Text Search</div>
      <div className={styles["content"]}>
        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {(!error && data.appendTextOptions.length > 0 && (
          <AppendTextOptions
            appendTextOptions={data.appendTextOptions}
            appendTextSelectedOption={data.appendText}
            onOptionSelectionChange={handleOptionSelectionChange}
          />
        )) || (
          <a className={styles["settings-nav"]} href="/settings.html" target="_blank">
            Open settings to add more append text options.
          </a>
        )}
      </div>
    </div>
  );
}
