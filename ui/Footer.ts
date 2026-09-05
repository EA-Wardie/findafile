import { BoxRenderable, CliRenderer, TextRenderable } from "@opentui/core";
import config from "../config.toml";

export class Footer {
  private static _footer: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._footer = new BoxRenderable(renderer, {
      width: "100%",
      height: 3,
      border: true,
      borderStyle: config.border_style,
      borderColor: config.theme.border,
      paddingLeft: 1,
      alignItems: "center",
    });

    this.makeText(renderer);

    return this._footer;
  }

  private static makeText(renderer: CliRenderer): void {
    this._footer.add(
      new TextRenderable(renderer, {
        selectable: false,
        content:
          "mouse all | ↑ ↓ ← → select | return down | esc up | q quit",
        fg: config.theme.border_muted,
      }),
    );
  }
}
