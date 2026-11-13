import checkUrl from "../../assets/icon/check.svg?url";
import { Icon } from "../_ui/Icon";
import "./Snackbar.css";

export type SnackbarProps = {
  message: string;
  /** Called once the show-and-fade animation has finished (unmount it then). */
  onDone?: () => void;
};

/**
 * Snackbar — brief confirmation after an action (e.g. 儲存成功！ after saving
 * today's outfit). A small ink pill with a check that rises in, holds ~2 s and
 * fades out on its own; it never takes a tap. Mount it with a fresh `key` to
 * show it again.
 */
export function Snackbar({ message, onDone }: SnackbarProps) {
  return (
    <div className="yw-snackbar" role="status" aria-live="polite" onAnimationEnd={onDone}>
      <Icon src={checkUrl} size={16} />
      <span>{message}</span>
    </div>
  );
}
