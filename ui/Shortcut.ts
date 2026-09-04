import { BoxRenderable, CliRenderer } from "@opentui/core";
import config from "../config.toml";

export class Shortcut {
  private static _shortcut: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._shortcut = new BoxRenderable(renderer, {
      width: "100%",
      height: 1,
      border: ["left"],
      borderColor: config.colors.purple,
      paddingLeft: 1,
      marginBottom: 1,
    });

    return this._shortcut;
  }
}
