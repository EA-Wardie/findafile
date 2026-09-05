import { BoxRenderable, CliRenderer } from "@opentui/core";
import config from "../config.toml";

export class SidebarSection {
  public static make(renderer: CliRenderer): BoxRenderable {
    return new BoxRenderable(renderer, {
      width: "100%",
      border: false,
      flexDirection: "column",
    });
  }
}
