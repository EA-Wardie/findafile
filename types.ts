export interface ShortcutType {
  label: string;
  path: string;
}

export interface Entry {
  name: string;
  isDir: boolean;
}

export interface ReadEntriesResult {
  entries: Entry[];
  error?: string;
}

export interface LastClick {
  path: string;
  time: number;
}
