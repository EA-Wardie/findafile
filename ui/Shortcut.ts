import config from "../lib/Config";
import {
  BoxRenderable,
  MouseEvent,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import type { ShortcutType } from "../types";
import { Navigator } from "../lib/Navigator";
import { Store } from "../lib/Store";

export interface Options extends BoxOptions {
  shortcut: ShortcutType;
}

export class Shortcut extends BoxRenderable {
  constructor(ctx: RenderContext, options: Options) {
    super(ctx, options);

    this.id = options.shortcut.path;
    this.width = "100%";
    this.height = 1;
    this.paddingX = 1;

    this.add(
      new TextRenderable(ctx, {
        content: `${options.shortcut.icon} ${options.shortcut.label}`,
        fg: config.theme.foreground,
        selectable: false,
      }),
    );

    this.onMouseOver = (): void => {
      if (Store.currentPath !== this.id) {
        // this.backgroundColor = config.theme.content;
        this.backgroundColor = config.theme.highlight;
      }
    };

    this.onMouseOut = (): void => {
      if (Store.currentPath !== this.id) {
        this.backgroundColor = undefined;
      }
    };

    this.onMouseDown = (event: MouseEvent): void => {
      if (event.button === 0) {
        Navigator.go(options.shortcut.path);
      }
    };

    this.highlight(Store.currentPath);

    Store.onCurrentPathChange((path: string) => {
      this.highlight(path);
    });
  }

  private highlight(path: string): void {
    this.backgroundColor =
      // path === this.id ? config.theme.selected_background : undefined;
      path === this.id ? config.theme.selected_background : undefined;
  }
}
