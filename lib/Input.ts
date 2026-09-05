import config from "../config.toml";
import { Store } from "./Store";

export class Input {
  public static isDoubleClick(path: string): boolean {
    const now: number = Date.now();

    return (
      Store.lastClick !== null &&
      Store.lastClick.path === path &&
      now - Store.lastClick.time < config.explorer.double_click_delay
    );
  }
}
