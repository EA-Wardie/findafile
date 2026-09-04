export interface ShortcutType {
  label: string;
  path: string;
  icon: string;
}

export interface EntryType {
  name: string;
  isDir: boolean;
}

export interface ReadEntriesResultType {
  entries: EntryType[];
  error?: string;
}

export interface LastClickType {
  path: string;
  time: number;
}
