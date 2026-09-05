import config from "../config.toml";
import {
  BoxRenderable,
  MouseEvent,
  Renderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import type { ShortcutType } from "../types";
import { Navigator } from "../lib/Navigator";
import { Shortcut } from "./Shortcut";
import { Store } from "../lib/Store";

export interface Options extends BoxOptions {
  shortcuts: ShortcutType[];
}

export class SidebarSection extends BoxRenderable {
  constructor(ctx: RenderContext, options: Options = { shortcuts: [] }) {
    super(ctx, options);

    this.width = "100%";
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.titleColor = config.theme.foreground;
    this.flexDirection = "column";
    this.flexGrow = 1;

    options.shortcuts.forEach((shortcut: ShortcutType, index: number) => {
      const shortcutBox = new Shortcut(ctx, { shortcut });

      if (shortcut.path === Store.currentPath) {
        shortcutBox.backgroundColor = config.theme.selected_background;
      }

      shortcutBox.onMouseDown = (event: MouseEvent): void => {
        if (event.button === 0) {
          this.selectShortcut(shortcut);
        }
      };

      this.add(shortcutBox);
    });
  }

  private selectShortcut(shortcut: ShortcutType) {
    Navigator.go(shortcut.path);

    this.getChildren().forEach((child: Renderable) => {
      const isSelected: boolean = child.id === shortcut.path;

      if (isSelected) {
        (child as BoxRenderable).backgroundColor =
          config.theme.selected_background;
      } else {
        (child as BoxRenderable).backgroundColor = undefined;
      }
    });
  }
}
