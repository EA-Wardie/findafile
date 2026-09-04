import { readdirSync, type Dirent } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import {
  BoxRenderable,
  ScrollBoxRenderable,
  TextAttributes,
  TextRenderable,
  createCliRenderer,
  type CliRenderer,
  type KeyEvent,
  type ScrollBoxRenderable as ScrollBoxRenderableType,
} from "@opentui/core";

interface Shortcut {
  label: string;
  path: string;
}

interface Entry {
  name: string;
  isDir: boolean;
}

interface ReadEntriesResult {
  entries: Entry[];
  error?: string;
}

interface LastClick {
  path: string;
  time: number;
}

const HOME: string = homedir();

const SHORTCUTS: Shortcut[] = [
  { label: "Home", path: HOME },
  { label: "Documents", path: join(HOME, "Documents") },
  { label: "Downloads", path: join(HOME, "Downloads") },
  { label: "Desktop", path: join(HOME, "Desktop") },
  { label: "Root", path: "/" },
];

const DOUBLE_CLICK_MS: number = 400;
const TILE_WIDTH: number = 12;
const TILE_HEIGHT: number = 6;
const SELECTED_BORDER_COLOR: string = "#e0af68";

function readEntries(path: string): ReadEntriesResult {
  try {
    const dirents: Dirent[] = readdirSync(path, { withFileTypes: true });

    const entries: Entry[] = dirents
      .map((d: Dirent): Entry => ({ name: d.name, isDir: d.isDirectory() }))
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

const renderer: CliRenderer = await createCliRenderer({
  exitOnCtrlC: true,
  backgroundColor: "#1a1b26",
});

let currentPath: string = HOME;
let selectedTile: BoxRenderable | null = null;
let lastClick: LastClick | null = null;

const root: BoxRenderable = new BoxRenderable(renderer, {
  width: "100%",
  height: "100%",
  flexDirection: "column",
  padding: 0,
  gap: 0,
});

const pathBar: TextRenderable = new TextRenderable(renderer, {
  content: currentPath,
  fg: "#c0caf5",
  attributes: TextAttributes.BOLD,
});

const backButtonIcon: TextRenderable = new TextRenderable(renderer, {
  content: "⬅️",
  fg: "#7aa2f7",
});

const backButton: BoxRenderable = new BoxRenderable(renderer, {
  width: 2,
  height: 1,
  onMouseDown: (): void => {
    const parent: string = dirname(currentPath);

    if (parent !== currentPath) {
      navigate(parent);
    }
  },
});
backButton.add(backButtonIcon);

const pathBarBox: BoxRenderable = new BoxRenderable(renderer, {
  width: "100%",
  height: 3,
  border: true,
  borderStyle: "single",
  borderColor: "#414868",
  titleColor: "#7aa2f7",
  paddingLeft: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: 1,
});

pathBarBox.add(backButton);
pathBarBox.add(pathBar);

const mainRow: BoxRenderable = new BoxRenderable(renderer, {
  width: "100%",
  flexGrow: 1,
  flexDirection: "row",
  gap: 1,
});

const sidebar: BoxRenderable = new BoxRenderable(renderer, {
  width: 28,
  height: "100%",
  border: true,
  borderStyle: "single",
  borderColor: "#414868",
  title: "Places",
  titleColor: "#bb9af7",
  flexDirection: "column",
  padding: 0,
});

const explorerBox: BoxRenderable = new BoxRenderable(renderer, {
  flexGrow: 1,
  height: "100%",
  border: true,
  borderStyle: "single",
  borderColor: "#414868",
  title: "Files",
  titleColor: "#7aa2f7",
  flexDirection: "column",
  padding: 0,
});

const explorer: ScrollBoxRenderableType = new ScrollBoxRenderable(renderer, {
  width: "100%",
  height: "100%",
  contentOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
  },
}) as ScrollBoxRenderableType;

explorerBox.add(explorer);

const footer: BoxRenderable = new BoxRenderable(renderer, {
  width: "100%",
  height: 3,
  border: true,
  borderStyle: "single",
  borderColor: "#414868",
  paddingLeft: 1,
  alignItems: "center",
});

footer.add(
  new TextRenderable(renderer, {
    content: "Double clikc a folder to open it | q to quit",
    fg: "#565f89",
  }),
);

mainRow.add(sidebar);
mainRow.add(explorerBox);
root.add(pathBarBox);
root.add(mainRow);
root.add(footer);
renderer.root.add(root);

function updateBackButtonState(): void {
  const parent: string = dirname(currentPath);
  const hasParent: boolean = parent !== currentPath;

  backButtonIcon.fg = hasParent ? "#7aa2f7" : "#414868";
}

function navigate(path: string): void {
  currentPath = path;
  pathBar.content = currentPath;
  selectedTile = null;
  lastClick = null;

  updateBackButtonState();
  renderExplorer();
}

function makeUpTile(parent: string): BoxRenderable {
  const upTile: BoxRenderable = new BoxRenderable(renderer, {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    border: true,
    borderStyle: "single",
    borderColor: "#565f89",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    onMouseDown: (): void => navigate(parent),
  });

  upTile.add(new TextRenderable(renderer, { content: "📁", fg: "#565f89" }));
  upTile.add(new TextRenderable(renderer, { content: "..", fg: "#565f89" }));

  return upTile;
}

function makeTile(
  label: string,
  isDir: boolean,
  fullPath: string,
): BoxRenderable {
  const tile: BoxRenderable = new BoxRenderable(renderer, {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    onMouseDown: (): void => {
      const now: number = Date.now();

      const isDoubleClick: boolean =
        isDir &&
        lastClick !== null &&
        lastClick.path === fullPath &&
        now - lastClick.time < DOUBLE_CLICK_MS;

      if (isDoubleClick) {
        navigate(fullPath);

        return;
      }

      if (selectedTile !== null && selectedTile !== tile) {
        selectedTile.border = false;
      }

      tile.border = true;
      selectedTile = tile;
      lastClick = { path: fullPath, time: now };
    },
  });

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
  return tile;
}

function renderExplorer(): void {
  for (const child of [...explorer.getChildren()]) {
    explorer.remove(child);
  }

  const { entries, error }: ReadEntriesResult = readEntries(currentPath);

  if (error !== undefined) {
    explorer.add(
      new TextRenderable(renderer, {
        content: `Error: ${error}`,
        fg: "#f7768e",
      }),
    );

    return;
  }

  const parent: string = dirname(currentPath);

  if (parent !== currentPath) {
    explorer.add(makeUpTile(parent));
  }

  if (entries.length === 0) {
    explorer.add(
      new TextRenderable(renderer, { content: "(empty)", fg: "#565f89" }),
    );
  }

  for (const entry of entries) {
    const fullPath: string = join(currentPath, entry.name);

    explorer.add(makeTile(entry.name, entry.isDir, fullPath));
  }
}

function renderSidebar(): void {
  for (const shortcut of SHORTCUTS) {
    const { error }: ReadEntriesResult = readEntries(shortcut.path);

    if (error !== undefined) {
      continue;
    }

    const row: BoxRenderable = new BoxRenderable(renderer, {
      width: "100%",
      height: 1,
      border: ["left"],
      borderColor: "#bb9af7",
      paddingLeft: 1,
      marginBottom: 1,
      onMouseDown: (): void => navigate(shortcut.path),
    });

    row.add(
      new TextRenderable(renderer, { content: shortcut.label, fg: "#bb9af7" }),
    );

    sidebar.add(row);
  }
}

renderSidebar();
updateBackButtonState();
renderExplorer();

renderer.keyInput.on("keypress", (key: KeyEvent): void => {
  if (key.name === "q") {
    renderer.destroy();
  }
});
