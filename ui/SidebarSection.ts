import config from "../config.toml";
import { BoxRenderable, CliRenderer } from "@opentui/core";

export class SidebarSection {
  public static make(renderer: CliRenderer, name: string): BoxRenderable {
    return new BoxRenderable(renderer, {
      width: "100%",
      border: true,
      borderColor: config.colors.border,
      flexDirection: "column",
      title: name,
      titleColor: config.colors.foreground,
      flexGrow: 1,
    });
  }
}
