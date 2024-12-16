import React from "react";
import { useRef } from "react";
import { useQuery } from "react-query";
import * as styles from "./settings-page.module.scss";
import { AppendTextStorageKey, getStorage, updateStorage } from "../../shared/storage";
import { RuntimePortMessageEvent } from "../../shared/message-event";

type SettingsPageProps = {
  commPort: chrome.runtime.Port;
};

export function SettingsPage({ commPort }: SettingsPageProps) {
  const {
    data: _data,
    isLoading,
    error
  } = useQuery<string, Error>(AppendTextStorageKey, {
    queryFn: async () => {
      const { appendText } = await getStorage();
      return appendText;
    },
    onSuccess(data) {
      if (data != null) {
        inputRef.current.value = data;
      }
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnSave = async () => {
    const newValue = (inputRef.current.value ?? "").trim();
    const appendText = newValue.length > 0 ? newValue : null;

    await updateStorage({ appendText });
    alert("Saved settings.");

    const msg: RuntimePortMessageEvent<"update-context-menu"> = {
      type: "update-context-menu"
    };
    commPort.postMessage(msg);
  };

  return (
    <>
      <div className={styles["heading"]}>Options</div>
      {(!error && (
        <div className={styles["settings-form"]}>
          <label htmlFor="word-input" className={styles["label"]}>
            Append Term
          </label>
          <form>
            <input
              id="word-input"
              className={styles["word-input"]}
              ref={inputRef}
              disabled={isLoading}
              placeholder={isLoading ? "Loading..." : "Set the text to append to the selection..."}
            />
            <button className={styles["save-button"]} disabled={isLoading} onClick={handleOnSave}>
              Save
            </button>
            <input type="submit" hidden onSubmit={handleOnSave} />
          </form>
        </div>
      )) || <span color="red">Error: {error.message}</span>}
    </>
  );
}
