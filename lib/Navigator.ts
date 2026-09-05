import { Explorer } from "../ui/Explorer";
import { Header } from "../ui/Header";
import { Sidebar } from "../ui/Sidebar";
import { Store } from "./Store";

export class Navigator {
  public static go(path: string) {
    Store.setCurrentPath(path);
    Store.setSelectedTile(null);
    Store.setLastClick(null);
    Header.setText(path);
    Explorer.render();
    Sidebar.updateSelection();
  }
}
