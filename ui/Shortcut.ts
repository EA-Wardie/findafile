import { BoxRenderable, CliRenderer } from "@opentui/core";

export class Shortcut {
  private static _shortcut: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._shortcut = new BoxRenderable(renderer, {
      width: "100%",
      height: 1,
      paddingLeft: 1,
    });

    return this._shortcut;
  }
}
