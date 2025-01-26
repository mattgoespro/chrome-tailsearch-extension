import { TailsearchOptions } from "./tailsearch-options/tailsearch-options";
import * as styles from "./popup.module.scss";
import { useStorage } from "../../shared/hooks/use-storage";

export function ActionPopup() {
  const [storage] = useStorage();

  return (
    <div className={styles["popup"]}>
      <div className={styles["heading"]}>Appended Text Search</div>
      <div className={styles["content"]}>
        {storage.loading && <div>Loading...</div>}
        {storage.error && <div>Error: {storage.error.message}</div>}
        {(!storage.error && storage.data.options?.length > 0 && <TailsearchOptions />) || (
          <a className={styles["settings-nav"]} href="/settings.html" target="_blank">
            Open settings to add more tailsearch options.
          </a>
        )}
      </div>
    </div>
  );
}
