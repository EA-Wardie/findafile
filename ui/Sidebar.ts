import config from "../config.toml";
import {
  BoxRenderable,
  CliRenderer,
  MouseEvent,
  TextRenderable,
} from "@opentui/core";
import type { ShortcutEntryType, ShortcutType } from "../types";
import { Store } from "../lib/Store";
import { Shortcut } from "./Shortcut";
import { SidebarSection } from "./SidebarSection";
import { Navigator } from "../lib/Navigator";

export class Sidebar {
  private static _renderer: CliRenderer;
  private static _sidebar: BoxRenderable;
  private static _entries: ShortcutEntryType[] = [];
  private static _placesBox: BoxRenderable;
  private static _bookmarksBox: BoxRenderable;
  private static _drivesBox: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._renderer = renderer;

    this._sidebar = new BoxRenderable(renderer, {
      minWidth: 24,
      height: "100%",
      flexDirection: "column",
    });

    this.makeBoxes();
    this.renderSection(config.places, this._placesBox);
    this.renderSection(config.bookmarks, this._bookmarksBox);
    this.renderSection(config.drives, this._drivesBox);
    this.updateSelection();

    return this._sidebar;
  }

  private static makeBoxes(): void {
    this._placesBox = SidebarSection.make(this._renderer, "Places");
    this._bookmarksBox = SidebarSection.make(this._renderer, "Bookmarks");
    this._drivesBox = SidebarSection.make(this._renderer, "Drives");

    this._sidebar.add(this._placesBox);
    this._sidebar.add(this._bookmarksBox);
    this._sidebar.add(this._drivesBox);
  }

  private static makeShortcut(shortcut: ShortcutType): BoxRenderable {
    const shortcutBox = Shortcut.make(this._renderer);

    shortcutBox.onMouseDown = (event: MouseEvent): void => {
      if (event.button === 0) {
        Navigator.go(shortcut.path);
      }
    };

    this._entries.push({ shortcut, box: shortcutBox });

    return shortcutBox;
  }

  public static updateSelection(): void {
    this._entries.forEach((entry) => {
      const isSelected: boolean = entry.shortcut.path === Store.currentPath;

      entry.box.backgroundColor = isSelected
        ? config.colors.selected_background
        : undefined;
    });

    const selected: ShortcutType | null =
      this._entries.find((entry) => entry.shortcut.path === Store.currentPath)
        ?.shortcut ?? null;

    Store.setSelectedShortcut(selected);
  }

  private static renderSection(
    shortcuts: ShortcutType[] | undefined,
    box: BoxRenderable,
  ): void {
    (shortcuts || []).forEach((shortcut: ShortcutType) => {
      const shortcutBox = this.makeShortcut(shortcut);

      shortcutBox.add(
        new TextRenderable(this._renderer, {
          content: `${shortcut.icon} ${shortcut.label}`,
          fg: config.colors.foreground,
        }),
      );

      box.add(shortcutBox);
    });
  }
}
