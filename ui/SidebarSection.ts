import config from "../config.toml";
import {
  BoxRenderable,
  MouseEvent,
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
  private shortcutBoxes: { shortcut: ShortcutType; box: BoxRenderable }[] = [];

  constructor(ctx: RenderContext, options: Options = { shortcuts: [] }) {
    super(ctx, options);

    this.width = "100%";
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.titleColor = config.theme.foreground;
    this.flexDirection = "column";
    this.flexGrow = 1;

    options.shortcuts.forEach((shortcut: ShortcutType) => {
      const shortcutBox = new Shortcut(ctx, { shortcut });

      shortcutBox.onMouseDown = (event: MouseEvent): void => {
        if (event.button === 0) {
          Navigator.go(shortcut.path);
        }
      };

      this.shortcutBoxes.push({ shortcut, box: shortcutBox });
      this.add(shortcutBox);
    });

    this.highlight(Store.currentPath);

    Store.onCurrentPathChange((path: string) => {
      this.highlight(path);
    });
  }

  private highlight(path: string): void {
    this.shortcutBoxes.forEach(({ shortcut, box }) => {
      box.backgroundColor =
        shortcut.path === path ? config.theme.selected_background : undefined;
    });
  }
}
