import { BoxRenderable, CliRenderer, TextRenderable } from "@opentui/core";
import config from "../config.toml";

export class Footer {
  private static _footer: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._footer = new BoxRenderable(renderer, {
      width: "100%",
      height: 3,
      border: true,
      borderStyle: "single",
      borderColor: config.colors.border,
      paddingLeft: 1,
      alignItems: "center",
    });

    this.makeText(renderer);

    return this._footer;
  }

  private static makeText(renderer: CliRenderer): void {
    this._footer.add(
      new TextRenderable(renderer, {
        content:
          "Mouse All | ↑ ↓ ← → Navigate | Enter Open | Escape Up | q Quit",
        fg: config.colors.border_muted,
      }),
    );
  }
}
