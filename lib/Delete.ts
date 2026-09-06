import { homedir } from "node:os";
import { join, basename, extname } from "node:path";
import {
  existsSync,
  mkdirSync,
  statSync,
  renameSync,
  rmSync,
  writeFileSync,
  cpSync,
} from "node:fs";
import { Store } from "./Store";

const TRASH_DIR: string = join(homedir(), ".local", "share", "Trash");
const TRASH_FILES_DIR: string = join(TRASH_DIR, "files");
const TRASH_INFO_DIR: string = join(TRASH_DIR, "info");

export class Delete {
  public static toTrash(fullPath: string): void {
    try {
      mkdirSync(TRASH_FILES_DIR, { recursive: true });
      mkdirSync(TRASH_INFO_DIR, { recursive: true });

      const { infoPath, targetPath } = this.reserveName(fullPath);

      this.writeTrashInfo(infoPath, fullPath);
      this.move(fullPath, targetPath);
    } catch (error) {
      Store.setError(`Error: ${(error as Error).message}`);
    }
  }

  private static reserveName(fullPath: string): {
    infoPath: string;
    targetPath: string;
  } {
    const original: string = basename(fullPath);
    const ext: string = extname(original);
    const stem: string = ext ? original.slice(0, -ext.length) : original;

    let name: string = original;
    let counter: number = 1;

    while (
      existsSync(join(TRASH_FILES_DIR, name)) ||
      existsSync(join(TRASH_INFO_DIR, `${name}.trashinfo`))
    ) {
      name = `${stem}.${counter}${ext}`;
      counter += 1;
    }

    return {
      infoPath: join(TRASH_INFO_DIR, `${name}.trashinfo`),
      targetPath: join(TRASH_FILES_DIR, name),
    };
  }

  private static writeTrashInfo(infoPath: string, fullPath: string): void {
    const content: string = [
      "[Trash Info]",
      `Path=${encodeURI(fullPath)}`,
      `DeletionDate=${new Date().toISOString()}`,
      "",
    ].join("\n");

    writeFileSync(infoPath, content, "utf-8");
  }

  private static move(fullPath: string, targetPath: string): void {
    const sourceDevice: number = statSync(fullPath).dev;
    const trashDevice: number = statSync(TRASH_FILES_DIR).dev;

    if (sourceDevice === trashDevice) {
      renameSync(fullPath, targetPath);

      return;
    }

    cpSync(fullPath, targetPath, { recursive: true });
    rmSync(fullPath, { recursive: true, force: true });
  }
}
