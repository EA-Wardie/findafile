import { type KeyEvent } from "@opentui/core";
import { Renderer } from "./ui/Renderer.ts";
import { Root } from "./ui/Root.ts";
import { Header } from "./ui/Header.ts";
import { Main } from "./ui/Main.ts";
import { Footer } from "./ui/Footer.ts";
import { Sidebar } from "./ui/Sidebar.ts";
import { Content } from "./ui/Content.ts";
import { Explorer } from "./ui/Explorer.ts";
import { ContextMenu } from "./ui/ContextMenu.ts";

const renderer = await Renderer.make();
const root = Root.make(renderer);
const header = Header.make(renderer);
const main = Main.make(renderer);
const sidebar = Sidebar.make(renderer);
const content = Content.make(renderer);
const explorer = Explorer.make(renderer);
const footer = Footer.make(renderer);

ContextMenu.make(renderer);

root.add(header);
root.add(main);
root.add(footer);
main.add(sidebar);
main.add(content);
content.add(explorer);
renderer.root.add(root);

Explorer.render();

renderer.keyInput.on("keypress", (key: KeyEvent): void => {
  if (key.name === "q") {
    renderer.destroy();
  }
});
