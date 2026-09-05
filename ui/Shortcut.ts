import { BoxRenderable, CliRenderer } from "@opentui/core";

export class Shortcut {
  public static make(renderer: CliRenderer): BoxRenderable {
    return new BoxRenderable(renderer, {
      width: "100%",
      height: 1,
    });
  }
}
