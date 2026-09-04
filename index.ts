import config from "./config.toml";
import { readdirSync, type Dirent } from "node:fs";
import { dirname, join } from "node:path";
import {
  BoxRenderable,
  ScrollBoxRenderable,
  TextAttributes,
  TextRenderable,
  type KeyEvent,
  type ScrollBoxRenderable as ScrollBoxRenderableType,
} from "@opentui/core";
import type { Entry, ReadEntriesResult, ShortcutType } from "./types.ts";
import { Renderer } from "./ui/Renderer.ts";
import { Root } from "./ui/Root.ts";
import { Header } from "./ui/Header.ts";
import { Main } from "./ui/Main.ts";
import { Footer } from "./ui/Footer.ts";
import { Sidebar } from "./ui/Sidebar.ts";
import { Store } from "./lib/Store.ts";
import { Shortcut } from "./ui/Shortcut.ts";
import { Content } from "./ui/Content.ts";
import { Explorer } from "./ui/Explorer.ts";
import { UpTile } from "./ui/UpTile.ts";
import { DownTile } from "./ui/DownTile.ts";

const PLACES: ShortcutType[] = config.places || [];
const BOOKMARKS: ShortcutType[] = config.bookmarks || [];
const DRIVES: ShortcutType[] = config.drives || [];
const DOUBLE_CLICK_MS: number = 400;
const TILE_WIDTH: number = 12;
const TILE_HEIGHT: number = Math.floor(TILE_WIDTH * 0.56);
const SELECTED_BORDER_COLOR: string = "#e0af68";

function readEntries(path: string): ReadEntriesResult {
  try {
    const dirents: Dirent[] = readdirSync(path, { withFileTypes: true });

    const entries: Entry[] = dirents
      .map((dirent: Dirent): Entry => ({
        name: dirent.name,
        isDir: dirent.isDirectory(),
      }))
      .sort((a: Entry, b: Entry): number => {
        if (a.isDir !== b.isDir) {
          return a.isDir ? -1 : 1;
        }

        return a.name.localeCompare(b.name);
      });

    return { entries };
  } catch (err) {
    return { entries: [], error: (err as Error).message };
  }
}

function truncate(name: string, maxLen: number): string {
  return name.length > maxLen ? `${name.slice(0, maxLen - 1)}…` : name;
}

const renderer = await Renderer.make();
const root = Root.make(renderer);
const header = Header.make(renderer);

const currentPathText = new TextRenderable(renderer, {
  content: Store.currentPath,
  attributes: TextAttributes.BOLD,
  fg: "#c0caf5",
});

header.add(currentPathText);

const main = Main.make(renderer);
const sidebar = Sidebar.make(renderer);
const content = Content.make(renderer);
const explorer = Explorer.make(renderer);
const footer = Footer.make(renderer);

const footerText = new TextRenderable(renderer, {
  content: "No log",
  fg: "#565f89",
});

root.add(header);
root.add(main);
root.add(footer);

main.add(sidebar);
main.add(content);

content.add(explorer);
footer.add(footerText);

renderer.root.add(root);

function navigate(path: string): void {
  Store.setCurrentPath(path);
  Store.setSelectedTile(null);
  Store.setLastClick(null);

  footerText.content = path;
  currentPathText.content = path;

  renderExplorer();
}

function makeUpTile(parent: string): BoxRenderable {
  const tile = UpTile.make(renderer);

  tile.add(new TextRenderable(renderer, { content: "📁", fg: "#565f89" }));
  tile.add(new TextRenderable(renderer, { content: "..", fg: "#565f89" }));
  tile.onMouseDown = (): void => navigate(parent);

  return tile;
}

function makeTile(
  label: string,
  isDir: boolean,
  fullPath: string,
): BoxRenderable {
  const tile = DownTile.make(renderer);

  tile.borderColor = SELECTED_BORDER_COLOR;
  tile.border = false;

  tile.add(
    new TextRenderable(renderer, {
      content: isDir ? "📁" : "📄",
      fg: isDir ? "#7aa2f7" : "#c0caf5",
    }),
  );

  tile.add(
    new TextRenderable(renderer, {
      content: truncate(label, TILE_WIDTH - 4),
      fg: isDir ? "#7aa2f7" : "#c0caf5",
    }),
  );

  tile.onMouseDown = (): void => {
    const now: number = Date.now();

    const isDoubleClick: boolean =
      isDir &&
      Store.lastClick !== null &&
      Store.lastClick.path === fullPath &&
      now - Store.lastClick.time < DOUBLE_CLICK_MS;

    if (isDoubleClick) {
      navigate(fullPath);

      return;
    }

    if (Store.selectedTile !== null && Store.selectedTile !== tile) {
      Store.selectedTile.border = false;
    }

    tile.border = true;

    Store.setSelectedTile(tile);
    Store.setLastClick({ path: fullPath, time: now });
  };

  return tile;
}

function renderExplorer(): void {
  for (const child of [...explorer.getChildren()]) {
    explorer.remove(child);
  }

  const { entries, error }: ReadEntriesResult = readEntries(Store.currentPath);

  if (error !== undefined) {
    explorer.add(
      new TextRenderable(renderer, {
        content: `Error: ${error}`,
        fg: "#f7768e",
      }),
    );

    return;
  }

  const parent: string = dirname(Store.currentPath);

  if (parent !== Store.currentPath) {
    explorer.add(makeUpTile(parent));
  }

  if (entries.length === 0) {
    explorer.add(
      new TextRenderable(renderer, { content: "(empty)", fg: "#565f89" }),
    );
  }

  for (const entry of entries) {
    const fullPath: string = join(Store.currentPath, entry.name);

    explorer.add(makeTile(entry.name, entry.isDir, fullPath));
  }
}

function makeShortcut(shortcut: ShortcutType): BoxRenderable {
  const shortcutBox = Shortcut.make(renderer);

  shortcutBox.onMouseDown = (): void => navigate(shortcut.path);

  return shortcutBox;
}

function renderPlaces(): void {
  for (const place of PLACES) {
    const placeBox = makeShortcut(place);

    placeBox.add(
      new TextRenderable(renderer, { content: place.label, fg: "#bb9af7" }),
    );

    sidebar.add(placeBox);
  }
}

function renderBookmarks(): void {
  for (const bookmark of BOOKMARKS) {
    const bookmarkBox = makeShortcut(bookmark);

    bookmarkBox.add(
      new TextRenderable(renderer, { content: bookmark.label, fg: "#bb9af7" }),
    );

    sidebar.add(bookmarkBox);
  }
}

function renderDrives(): void {
  for (const drive of DRIVES) {
    const driveBox = makeShortcut(drive);

    driveBox.add(
      new TextRenderable(renderer, { content: drive.label, fg: "#bb9af7" }),
    );

    sidebar.add(driveBox);
  }
}

function renderSidebar(): void {
  renderPlaces();
  renderBookmarks();
  renderDrives();
}

renderSidebar();
renderExplorer();

renderer.keyInput.on("keypress", (key: KeyEvent): void => {
  if (key.name === "q") {
    renderer.destroy();
  }
});
