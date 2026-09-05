import { BoxRenderable, CliRenderer } from "@opentui/core";

export class Main {
  public static make(renderer: CliRenderer): BoxRenderable {
    return new BoxRenderable(renderer, {
      width: "100%",
      flexGrow: 1,
      flexDirection: "row",
      gap: 1,
    });
  }
}
