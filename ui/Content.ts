import { BoxRenderable, CliRenderer } from "@opentui/core";
import config from "../config.toml";

export class Content {
  public static make(renderer: CliRenderer): BoxRenderable {
    return new BoxRenderable(renderer, {
      flexGrow: 1,
      height: "100%",
      border: true,
      borderStyle: config.border_style,
      borderColor: config.theme.border,
      title: "Explorer",
      titleColor: config.theme.foreground,
      flexDirection: "column",
    });
  }
}
