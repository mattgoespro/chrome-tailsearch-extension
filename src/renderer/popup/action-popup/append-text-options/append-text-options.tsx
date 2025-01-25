import { uuid } from "../../../../shared/uuid";
import * as styles from "./append-text-options.module.scss";

type AppendTextOptionsProps = {
  appendTextOptions: string[];
};

export function AppendTextOptions(props: AppendTextOptionsProps) {
  return (
    <select className={styles["select"]}>
      {props.appendTextOptions.map((option) => (
        <span className={styles["select-option"]} key={uuid()}>
          {option}
        </span>
      ))}
    </select>
  );
}
