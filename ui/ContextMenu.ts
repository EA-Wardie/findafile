import { BoxRenderable, CliRenderer, TextRenderable } from "@opentui/core";
import config from "../config.toml";
import type { ContextMenuItemType } from "../types.ts";

export class ContextMenu {
  private static _renderer: CliRenderer;
  private static _overlay: BoxRenderable;
  private static _menu: BoxRenderable;
  private static _open: boolean = false;

  public static make(renderer: CliRenderer): void {
    this._renderer = renderer;

    this._overlay = new BoxRenderable(renderer, {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      zIndex: 100,
      onMouseDown: (): void => ContextMenu.hide(),
    });

    this._menu = new BoxRenderable(renderer, {
      position: "absolute",
      width: 20,
      border: true,
      borderColor: config.colors.border,
      backgroundColor: config.colors.background,
      flexDirection: "column",
      paddingX: 1,
      zIndex: 101,
    });
  }

  public static show(items: ContextMenuItemType[], x: number, y: number): void {
    if (this._open) {
      ContextMenu.hide();
    }

    for (const child of [...this._menu.getChildren()]) {
      this._menu.remove(child);
    }

    items.forEach((item, index) => {
      const row: BoxRenderable = new BoxRenderable(this._renderer, {
        width: "100%",
        marginBottom: index < items.length - 1 ? 1 : 0,
        onMouseDown: (): void => {
          ContextMenu.hide();
          item.onSelect();
        },
      });

      row.add(
        new TextRenderable(this._renderer, {
          content: item.label,
          fg: config.colors.foreground,
          // marginX: 1,
        }),
      );

      this._menu.add(row);
    });

    this._menu.left = x;
    this._menu.top = y;

    this._renderer.root.add(this._overlay);
    this._renderer.root.add(this._menu);

    this._open = true;
  }

  public static hide(): void {
    if (!this._open) {
      return;
    }

    this._renderer.root.remove(this._overlay);
    this._renderer.root.remove(this._menu);

    this._open = false;
  }
}
