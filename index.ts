import { createCliRenderer, type KeyEvent } from "@opentui/core";
import { Header } from "./ui/Header.ts";
import { Main } from "./ui/Main.ts";
import { Footer } from "./ui/Footer.ts";
import { Sidebar } from "./ui/Sidebar.ts";
import { Content } from "./ui/Content.ts";
import { Explorer } from "./ui/Explorer.ts";
import { Details } from "./ui/Details.ts";
import { Preview } from "./ui/Preview.ts";
import { Store } from "./lib/Store.ts";

const renderer = await createCliRenderer();
const header = new Header(renderer);
const main = new Main(renderer);
const sidebar = new Sidebar(renderer);
const content = new Content(renderer);
const explorer = new Explorer(renderer);
const details = new Details(renderer);
const preview = new Preview(renderer);
const footer = new Footer(renderer);

main.add(sidebar);
main.add(content);
main.add(details);
main.add(preview);

content.add(explorer);

renderer.root.width = "100%";
renderer.root.height = "100%";
renderer.root.flexDirection = "column";
renderer.root.paddingX = 1;

renderer.root.add(header);
renderer.root.add(main);
renderer.root.add(footer);

renderer.keyInput.on("keypress", (key: KeyEvent): void => {
  if (key.name === "q") {
    renderer.destroy();

    return;
  }

  if (
    key.name === "up" ||
    key.name === "down" ||
    key.name === "left" ||
    key.name === "right"
  ) {
    explorer.move(key.name);

    return;
  }

  if (key.name === "return" || key.name === "enter") {
    explorer.openSelected();

    return;
  }

  if (key.name === "escape") {
    if (details.visible) {
      Store.hideDetails(renderer);
    } else if (preview.visible) {
      Store.hidePreview(renderer);
    } else {
      explorer.navigateUp();
    }
  }
});
