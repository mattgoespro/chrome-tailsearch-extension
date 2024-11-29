import React from "react";
import { useRef } from "react";
import { useQuery } from "react-query";
import * as styles from "./settings-page.module.scss";
import { AppendTextStorageKey, getStorage, updateStorage } from "../../shared/storage";

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

    commPort.postMessage({ type: "update-context-menu" });
  };

  return (
    <>
      <div className={styles["heading"]}>Options</div>
      {(!error && (
        <div className={styles["settings-form"]}>
          <label htmlFor="word-input">Append Term</label>
          <input
            id="word-input"
            className={styles["word-input"]}
            ref={inputRef}
            placeholder={isLoading ? "Loading..." : "Set the text to append to the selection..."}
          />
          <button className={styles["save-button"]} disabled={isLoading} onClick={handleOnSave}>
            Save
          </button>
        </div>
      )) || <span color="red">Error: {error.message}</span>}
    </>
  );
}
