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
        label: "Places",
        shortcuts: config.places || [],
      }),
    );

    this.add(
      new SidebarSection(ctx, {
        label: "Bookmarks",
        shortcuts: config.bookmarks || [],
        marginTop: 1,
      }),
    );

    this.add(
      new SidebarSection(ctx, {
        label: "Drives",
        shortcuts: config.drives || [],
        marginTop: 1,
      }),
    );
  }
}
