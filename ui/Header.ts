import { BoxRenderable, CliRenderer, Renderable } from "@opentui/core";
import config from "../config.toml";

export class Header {
  private static _header: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._header = new BoxRenderable(renderer, {
      width: "100%",
      height: 3,
      border: true,
      borderStyle: "single",
      borderColor: config.colors.border,
      titleColor: config.colors.accent,
      paddingLeft: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 1,
    });

    return this._header;
  }

  public static addChild(child: Renderable) {
    this._header.add(child);
  }
}
