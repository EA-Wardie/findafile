import { BoxRenderable, CliRenderer } from "@opentui/core";

export class Sidebar {
  private static _sidebar: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._sidebar = new BoxRenderable(renderer, {
      width: 28,
      height: "100%",
      border: true,
      borderStyle: "single",
      borderColor: "#414868",
      title: "Places",
      titleColor: "#bb9af7",
      flexDirection: "column",
    });

    return this._sidebar;
  }
}
