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
      width: 28,
      height: "100%",
      flexDirection: "column",
    });

    this.makeBoxes();
    this.renderPlaces();
    this.renderBookmarks();
    this.renderDrives();
    this.selectShortcut()

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

    shortcutBox.borderColor = config.colors.purple;
    shortcutBox.border = false;
    shortcutBox.onMouseDown = (event: MouseEvent): void => {
      if (event.button === 0) {
        Navigator.go(shortcut.path);
      }
    };

    this._entries.push({ shortcut, box: shortcutBox });

    return shortcutBox;
  }

  private static selectShortcut(): void {
    const selected: ShortcutType | null =
      this._entries.find((entry) => entry.shortcut.path === Store.currentPath)
        ?.shortcut ?? null;

    Store.setSelectedShortcut(selected);

    this._entries.forEach((entry) => {
      entry.box.border =
        entry.shortcut.path === Store.currentPath ? ["left"] : false;
    });
  }

  private static renderPlaces(): void {
    (config.places || []).forEach((place: ShortcutType) => {
      const placeBox = this.makeShortcut(place);

      placeBox.add(
        new TextRenderable(this._renderer, {
          content: `${place.icon} ${place.label}`,
          fg: config.colors.purple,
        }),
      );

      this._placesBox.add(placeBox);
    });
  }

  private static renderBookmarks() {
    (config.bookmarks || []).forEach((bookmark: ShortcutType) => {
      const bookmarkBox = this.makeShortcut(bookmark);

      bookmarkBox.add(
        new TextRenderable(this._renderer, {
          content: `${bookmark.icon} ${bookmark.label}`,
          fg: config.colors.purple,
        }),
      );

      this._bookmarksBox.add(bookmarkBox);
    });
  }

  private static renderDrives() {
    (config.drives || []).forEach((drive: ShortcutType) => {
      const driveBox = this.makeShortcut(drive);

      driveBox.add(
        new TextRenderable(this._renderer, {
          content: `${drive.icon} ${drive.label}`,
          fg: config.colors.purple,
        }),
      );

      this._drivesBox.add(driveBox);
    });
  }
}
