import config from "../config.toml";
import {
  ASCIIFontRenderable,
  BoxRenderable,
  RGBA,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { SidebarSection } from "./SidebarSection";

export class Sidebar extends BoxRenderable {
  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.minWidth = 24;
    this.height = "100%";
    this.backgroundColor = config.theme.sidebar;
    this.flexDirection = "column";

    const topbar = new BoxRenderable(ctx, {
      height: 3,
      backgroundColor: config.theme.content,
      alignItems: "center",
    });

    topbar.add(
      new ASCIIFontRenderable(ctx, {
        text: "FAF",
        font: "tiny",
      }),
    );

    this.add(topbar);

    this.add(
      new SidebarSection(ctx, {
        shortcuts: config.places || [],
      }),
    );

    this.add(
      new BoxRenderable(ctx, {
        border: ["top"],
        borderStyle: config.border_style,
        borderColor: config.theme.border,
      }),
    );

    this.add(
      new SidebarSection(ctx, {
        shortcuts: config.bookmarks || [],
      }),
    );

    this.add(
      new BoxRenderable(ctx, {
        border: ["top"],
        borderStyle: config.border_style,
        borderColor: config.theme.border,
      }),
    );

    this.add(
      new SidebarSection(ctx, {
        shortcuts: config.drives || [],
      }),
    );
  }
}
