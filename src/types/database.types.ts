export type Properties = {
  key: string;
  content: string;
};

export type DatabaseContent = {
  prefix: Properties[];
  muterole: Properties[];
  autorole: Properties[];
};

export const DB_CONTENT: DatabaseContent = {
  prefix: [],
  muterole: [],
  autorole: []
} as const;

export type DatabaseOptions = keyof DatabaseContent;

export type DatabasePieces = {
  createDatabaseFile(): Promise<void>;
  get(option: DatabaseOptions, key: string): string | null;
  has(option: DatabaseOptions, key: string): boolean;
  hasExactValue(option: DatabaseOptions, key: string, value: string): boolean;
  add(option: DatabaseOptions, key: string, value: string): Promise<void>;
  modify(option: DatabaseOptions, key: string, value: string): Promise<void>;
  delete(option: DatabaseOptions, key: string): Promise<void>;
};
