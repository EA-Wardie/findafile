import { BoxRenderable, CliRenderer } from "@opentui/core";
import config from "../config.toml";

export class Sidebar {
  private static _sidebar: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._sidebar = new BoxRenderable(renderer, {
      width: 28,
      height: "100%",
      border: true,
      borderStyle: "single",
      borderColor: config.colors.border,
      title: "Places",
      titleColor: config.colors.purple,
      flexDirection: "column",
    });

    return this._sidebar;
  }
}
