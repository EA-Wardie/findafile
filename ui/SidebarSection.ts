import { BoxRenderable, CliRenderer } from "@opentui/core";
import config from "../config.toml";

export class SidebarSection {
  public static make(renderer: CliRenderer, title: string): BoxRenderable {
    return new BoxRenderable(renderer, {
      width: "100%",
      flexGrow: 1,
      border: true,
      borderStyle: "single",
      borderColor: config.colors.border,
      title,
      titleColor: config.colors.purple,
      flexDirection: "column",
    });
  }
}
