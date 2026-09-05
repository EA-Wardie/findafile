import { BoxRenderable, CliRenderer } from "@opentui/core";
import config from "../config.toml";

export class Content {
  private static _content: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._content = new BoxRenderable(renderer, {
      flexGrow: 1,
      height: "100%",
      border: true,
      borderColor: config.colors.border,
      title: "Explorer",
      titleColor: config.colors.foreground,
      flexDirection: "column",
    });

    return this._content;
  }
}
