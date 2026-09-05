import {
  BoxRenderable,
  CliRenderer,
  TextAttributes,
  TextRenderable,
} from "@opentui/core";
import config from "../config.toml";
import { Store } from "../lib/Store";

export class Header {
  private static _renderer: CliRenderer;
  private static _header: BoxRenderable;
  private static _headerText: TextRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._renderer = renderer;

    this._header = new BoxRenderable(this._renderer, {
      width: "100%",
      height: 3,
      border: true,
      borderStyle: "single",
      borderColor: config.colors.border,
      titleColor: config.colors.accent,
      paddingLeft: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 1,
    });

    this.makeText();

    return this._header;
  }

  private static makeText(): void {
    this._headerText = new TextRenderable(this._renderer, {
      content: Store.currentPath,
      attributes: TextAttributes.BOLD,
      fg: config.colors.foreground,
    });

    this._header.add(this._headerText);
  }

  public static setText(content: string): void {
    this._headerText.content = content;
  }
}
