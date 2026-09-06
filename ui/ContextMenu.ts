import config from "../config.toml";
import {
  BoxRenderable,
  CliRenderer,
  Renderable,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import type { ContextMenuItemType } from "../types.ts";

export interface Options extends BoxOptions {
  items: ContextMenuItemType[];
}

export class ContextMenu extends BoxRenderable {
  private overlay: BoxRenderable;
  private items: ContextMenuItemType[] = [];
  private open: boolean = false;

  constructor(ctx: RenderContext, options: Options) {
    super(ctx, options);

    this.position = "absolute";
    this.minWidth = 20;
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.backgroundColor = config.theme.background;
    this.flexDirection = "column";
    this.title = "Menu";
    this.titleColor = config.theme.foreground;
    this.zIndex = 101;
    this.items = options.items;

    this.overlay = new BoxRenderable(ctx, {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 100,
      onMouseDown: (): void => this.hide(),
    });
  }

  public show(x: number, y: number): void {
    if (this.open) {
      this.hide();
    }

    this.getChildren().forEach((child: Renderable) => {
      this.remove(child);
    });

    this.items.forEach((item) => {
      if (!item.separator) {
        const row: BoxRenderable = new BoxRenderable(this.ctx, {
          width: "100%",
          paddingX: 1,
          onMouseDown: (): void => {
            this.hide();
            item.onSelect?.();
          },
          onMouseOver: (): void => {
            row.backgroundColor = config.theme.selected_background;
          },
          onMouseOut: (): void => {
            row.backgroundColor = undefined;
          },
        });

        row.add(
          new TextRenderable(this.ctx, {
            content: item.label,
            fg: config.theme.foreground,
            selectable: false,
          }),
        );

        this.add(row);
      } else {
        this.add(
          new BoxRenderable(this.ctx, {
            width: "100%",
            border: ["top"],
            borderColor: config.theme.border,
          }),
        );
      }
    });

    this.left = x;
    this.top = y;
    this.open = true;

    (this.ctx as CliRenderer).root.add(this.overlay);
    (this.ctx as CliRenderer).root.add(this);
  }

  public hide(): void {
    if (!this.open) {
      return;
    }

    this.open = false;

    (this.ctx as CliRenderer).root.remove(this.overlay);
    (this.ctx as CliRenderer).root.remove(this);
  }
}
