import config from "../config.toml";
import { basename, extname } from "node:path";
import { readFileSync } from "node:fs";
import {
  BoxRenderable,
  CodeRenderable,
  ImageRenderable,
  LineNumberRenderable,
  SyntaxStyle,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { Store } from "../lib/Store";

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
    // this.border = true;
    // this.border = ["left"];
    // this.borderStyle = config.border_style;
    // this.borderColor = config.theme.border;
    // this.borderColor = config.theme.border;
    // this.title = "Preview";
    // this.titleColor = config.theme.foreground;
    this.backgroundColor = config.theme.content;
    this.flexDirection = "column";
    // this.paddingX = 1;
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

    this.code = new CodeRenderable(ctx, {
      content: "",
      syntaxStyle: SyntaxStyle.create(),
      wrapMode: "word",
      flexGrow: 1,
    });

    this.lineNumbers = new LineNumberRenderable(ctx, {
      target: this.code,
      // minWidth: 3,
      // paddingRight: 1,
      fg: "#6b7280",
      bg: config.theme.sidebar,
    });

    this.image = new ImageRenderable(ctx, {
      fit: "fit",
      flexGrow: 1,
      onError: (): void => Store.hidePreview(this.ctx),
    });

    // this.add(this.name);
    this.add(header);
    // this.add(this.code);
    this.add(this.lineNumbers);
    this.add(this.image);

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
      this.code.content = readFileSync(path, "utf-8");
      this.code.filetype = FILETYPES[extname(path)];
    } catch (error) {
      Store.hidePreview(this.ctx);
    }
  }
}
