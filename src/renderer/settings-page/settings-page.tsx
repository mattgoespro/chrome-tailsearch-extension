import React from "react";
import { useRef } from "react";
import { useQuery } from "react-query";
import * as styles from "./settings-page.module.scss";
import { AppendTextStorage, AppendTextStorageKey } from "../../shared/storage";

type SettingsPageProps = {
  commPort: chrome.runtime.Port;
};

export function SettingsPage(props: SettingsPageProps) {
  const { data, isLoading, error } = useQuery<string, Error>(AppendTextStorageKey, {
    queryFn: async () => {
      const { appendText } = await chrome.storage.sync.get<AppendTextStorage>(AppendTextStorageKey);
      return appendText;
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnSave = () => {
    const newValue = (inputRef.current.value ?? "").trim();

    if (newValue.length > 0) {
      chrome.storage.sync.set<AppendTextStorage>({ appendText: newValue }, () => {
        alert("Saved settings.");
      });
    }
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
            placeholder={isLoading ? "Loading..." : undefined}
            defaultValue={data}
          />
          <button className={styles["save-button"]} disabled={isLoading} onClick={handleOnSave}>
            Save
          </button>
        </div>
      )) || <span color="red">Error: {error.message}</span>}
    </>
  );
}
