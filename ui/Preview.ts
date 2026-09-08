import config from "../config.toml";
import { basename, extname } from "node:path";
import { readFileSync } from "node:fs";
import {
  BoxRenderable,
  CodeRenderable,
  getTreeSitterClient,
  ImageRenderable,
  LineNumberRenderable,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { Store } from "../lib/Store";
import { Syntax } from "../lib/Syntax";

const FILETYPES: Record<string, string> = {
  ".ts": "typescript",
  ".tsx": "tsx",
  ".js": "javascript",
  ".jsx": "jsx",
  ".md": "markdown",
  ".zig": "zig",
};

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

export class Preview extends BoxRenderable {
  private name: TextRenderable;
  private code: CodeRenderable;
  private lineNumbers: LineNumberRenderable;
  private image: ImageRenderable;

  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.id = "preview";
    this.width = "50%";
    this.height = "100%";
    this.backgroundColor = config.theme.content;
    this.flexDirection = "column";
    this.visible = false;

    const header = new BoxRenderable(ctx, {
      height: 3,
      backgroundColor: config.theme.header,
      paddingX: 2,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    });

    this.name = new TextRenderable(ctx, {
      content: "",
      height: 1,
      fg: config.theme.foreground,
      selectable: false,
    });

    const close = new TextRenderable(this.ctx, {
      content: "❌",
      height: 1,
      fg: config.theme.foreground,
      selectable: false,
      onMouseOver: (): void => {
        close.bg = config.theme.selected_background;
      },
      onMouseOut: (): void => {
        close.bg = undefined;
      },
      onMouseDown: (): void => {
        Store.hidePreview(this.ctx);
      },
    });

    header.add(this.name);
    header.add(close);

    this.image = new ImageRenderable(ctx, {
      fit: "fit",
      flexGrow: 1,
      onError: (): void => Store.hidePreview(this.ctx),
    });

    this.add(header);

    this.code = new CodeRenderable(ctx, {
      content: "",
      wrapMode: "word",
      flexGrow: 1,
      syntaxStyle: Syntax.getStyles(),
    });

    this.lineNumbers = new LineNumberRenderable(ctx, {
      target: this.code,
      fg: "#6b7280",
      bg: config.theme.sidebar,
    });

    this.add(this.image);
    this.add(this.lineNumbers);
    this.refresh(Store.selectedTile);

    Store.onSelectedTileChange((tile: BoxRenderable | null) => {
      this.refresh(tile);
    });
  }

  private refresh(tile: BoxRenderable | null): void {
    const path: string = tile?.id || "";

    if (!path) {
      Store.hidePreview(this.ctx);

      return;
    }

    this.name.content = `Preview: ${basename(path)}`;

    if (IMAGE_EXTENSIONS.has(extname(path).toLowerCase())) {
      this.code.visible = false;
      this.image.visible = true;
      this.image.flexGrow = 1;
      this.image.height = "auto";
      this.image.source = path;

      return;
    }

    this.image.visible = false;
    this.code.visible = true;

    try {
      const tsClient = getTreeSitterClient();
      const contents = readFileSync(path, "utf-8");
      const fileType = FILETYPES[extname(path)];

      tsClient.initialize().then(() => {
        this.code.content = contents;
        this.code.filetype = fileType;
        this.code.treeSitterClient = tsClient;
      });
    } catch (error) {
      Store.hidePreview(this.ctx);
    }
  }
}
