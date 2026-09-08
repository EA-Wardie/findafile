import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { Store } from "./Store";

export class Create {
  public static file(fullPath: string): void {
    try {
      if (existsSync(fullPath)) {
        throw new Error("A file or folder with that name already exists");
      }

      writeFileSync(fullPath, "");
    } catch (error) {
      Store.setError(`Error: ${(error as Error).message}`);
    }
  }

  public static folder(fullPath: string): void {
    try {
      if (existsSync(fullPath)) {
        throw new Error("A file or folder with that name already exists");
      }

      mkdirSync(fullPath);
    } catch (error) {
      Store.setError(`Error: ${(error as Error).message}`);
    }
  }
}
