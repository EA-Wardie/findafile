import config from "../config.toml";
import { BoxRenderable, CliRenderer } from "@opentui/core";

export class SidebarSection {
  public static make(renderer: CliRenderer, name: string): BoxRenderable {
    return new BoxRenderable(renderer, {
      width: "100%",
      border: true,
      borderStyle: config.border_style,
      borderColor: config.theme.border,
      flexDirection: "column",
      title: name,
      titleColor: config.theme.foreground,
      flexGrow: 1,
    });
  }
}
