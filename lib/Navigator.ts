import { Explorer } from "../ui/Explorer";
import { Header } from "../ui/Header";
import { Store } from "./Store";

export class Navigator {
  public static go(path: string, after?: () => void) {
    Store.setCurrentPath(path);
    Store.setSelectedTile(null);
    Store.setLastClick(null);
    Header.setText(path);
    Explorer.render();

    after?.();
  }
}
