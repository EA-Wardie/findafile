import config from "../config.toml";
import { BoxRenderable, CliRenderer } from "@opentui/core";

export class Root {
  public static make(renderer: CliRenderer): BoxRenderable {
    return new BoxRenderable(renderer, {
      width: "100%",
      height: "100%",
      // backgroundColor: config.colors.background,
      flexDirection: "column",
      paddingX: 1,
    });
  }
}
