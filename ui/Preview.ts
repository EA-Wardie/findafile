import config from "../config.toml";
import { basename, extname } from "node:path";
import { readFileSync } from "node:fs";
import {
  BoxRenderable,
  CodeRenderable,
  ImageRenderable,
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
  private image: ImageRenderable;

  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.id = "preview";
    this.minWidth = "40%";
    this.height = "100%";
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.title = "Preview";
    this.titleColor = config.theme.foreground;
    this.flexDirection = "column";
    this.paddingX = 1;
    this.visible = false;

    this.name = new TextRenderable(ctx, {
      content: "",
      height: 1,
      fg: config.theme.foreground,
      selectable: false,
    });

    this.code = new CodeRenderable(ctx, {
      content: "",
      syntaxStyle: SyntaxStyle.create(),
      wrapMode: "word",
      flexGrow: 1,
    });

    this.image = new ImageRenderable(ctx, {
      fit: "fit",
      flexGrow: 1,
      onError: (): void => Store.hidePreview(this.ctx),
    });

    this.add(this.name);
    this.add(this.code);
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

    this.name.content = `Name: ${basename(path)}`;

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
