import { AppendTextOptions } from "./append-text-options/append-text-options";
import * as styles from "./action-popup.module.scss";

type ActionPopupProps = {
  commPort: chrome.runtime.Port;
  appendTextOptions: string[];
};

export function ActionPopup(props: ActionPopupProps) {
  return (
    <div className={styles["popup"]}>
      <div className={styles["heading"]}>Appended Text Search</div>
      <div className={styles["content"]}>
        {(props.appendTextOptions.length > 0 && (
          <AppendTextOptions appendTextOptions={props.appendTextOptions} />
        )) || (
          <a href="/settings.html" target="_blank">
            Go to settings to add options
          </a>
        )}
      </div>
    </div>
  );
}
