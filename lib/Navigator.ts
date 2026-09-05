import { Store } from "./Store";

export class Navigator {
  public static go(path: string) {
    Store.setCurrentPath(path);
    Store.setSelectedTile(null);
    Store.setLastClick(null);
  }
}
