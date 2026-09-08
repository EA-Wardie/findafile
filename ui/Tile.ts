import config from "../config.toml";
import { basename } from "node:path";
import {
  BoxRenderable,
  CliRenderer,
  MouseEvent,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import type { ContextMenuItemType } from "../types";
import { Formatter } from "../lib/Formatter";
import { Store } from "../lib/Store";
import { Navigator } from "../lib/Navigator";
import { Delete } from "../lib/Delete";
import { Input } from "../lib/Input";
import { ContextMenu } from "./ContextMenu";
import { ConfirmDialog } from "./ConfirmDialog";

export interface Options extends BoxOptions {
  label: string;
  icon: string;
  isDir: boolean;
  fullPath?: string;
  onSelect?: () => void;
  onOpen?: () => void;
  onDeleted?: () => void;
}

export class Tile extends BoxRenderable {
  public readonly isDir: boolean;
  public readonly fullPath?: string;

  constructor(
    ctx: RenderContext,
    options: Options = {
      label: "",
      icon: "📁",
      isDir: false,
    },
  ) {
    super(ctx, options);

    this.isDir = options.isDir;
    this.fullPath = options.fullPath;

    if (options.fullPath) {
      this.id = options.fullPath;
    }

    this.width = config.explorer.tile_width;
    this.height = config.explorer.tile_height;
    this.flexDirection = "column";
    this.alignItems = "center";
    this.justifyContent = "center";

    this.onMouseOver = (): void => {
      if (Store.selectedTile !== this) {
        this.backgroundColor = config.theme.sidebar;
      }
    };

    this.onMouseOut = (): void => {
      if (Store.selectedTile !== this) {
        this.backgroundColor = undefined;
      }
    };

    this.add(
      new TextRenderable(ctx, {
        content: options.icon,
        fg: config.theme.foreground,
        selectable: false,
      }),
    );

    this.add(
      new TextRenderable(ctx, {
        content: Formatter.truncate(
          options.label,
          config.explorer.tile_width - 2,
        ),
        fg: config.theme.foreground,
        selectable: false,
      }),
    );

    if (options.fullPath) {
      const fullPath: string = options.fullPath;

      this.onMouseDown = (event: MouseEvent): void => {
        if (event.button === 2 && options.label !== "Back") {
          this.showContextMenu(event, fullPath, options.onDeleted);
          options.onSelect?.();

          return;
        }

        if (this.isDir && Input.isDoubleClick(fullPath)) {
          options.onOpen?.();
        }

        options.onSelect?.();
        Store.setLastClick({ path: fullPath, time: Date.now() });
      };
    }
  }

  public select(): void {
    if (Store.selectedTile !== null && Store.selectedTile !== this) {
      (Store.selectedTile as Tile).setSelected(false);
    }

    this.setSelected(true);

    Store.setSelectedTile(this);
  }

  public setSelected(selected: boolean): void {
    this.backgroundColor = selected
      ? config.theme.selected_background
      : undefined;
  }

  private showContextMenu(
    event: MouseEvent,
    fullPath: string,
    onDeleted?: () => void,
  ): void {
    const items: ContextMenuItemType[] = [
      {
        label: "📂 Open",
        onSelect: (): void => {
          Navigator.go(fullPath);
        },
      },
      { separator: true },
      {
        label: "📋 Copy",
        onSelect: (): void => {
          (this.ctx as CliRenderer).copyToClipboardOSC52(fullPath);
        },
      },
      {
        label: "🗑️ Delete",
        onSelect: (): void => {
          const dialog = new ConfirmDialog(this.ctx);

          Store.setCurrentConfirmDialog(dialog);

          dialog.show({
            title: "Delete",
            description: `Move "${basename(fullPath)}" to trash?`,
            confirmLabel: "Delete",
            onConfirm: (): void => {
              Delete.toTrash(fullPath);
              onDeleted?.();
            },
          });
        },
      },
      { separator: true },
      {
        label: "❔ Details",
        onSelect: (): void => {
          Store.hidePreview(this.ctx);
          Store.showDetails(this.ctx);
        },
      },
      {
        label: "👁️ Preview",
        onSelect: (): void => {
          Store.hideDetails(this.ctx);
          Store.showPreview(this.ctx);
        },
      },
    ];

    new ContextMenu(this.ctx, { items }).show(event.x, event.y);
  }
}
