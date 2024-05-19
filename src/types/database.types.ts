import type { Snowflake } from "discord.js";

export type Properties = {
  key: Snowflake;
  content: string;
}

export type DatabaseContent = {
  prefix: Properties[];
}

export const DB_CONTENT: DatabaseContent = {
  prefix: []
} as const;

export type DatabaseOptions = keyof DatabaseContent;

export type DatabasePieces = {
  createDatabaseFile(): Promise<void>;
  get(option: DatabaseOptions, key: Snowflake): string | null;
  has(option: DatabaseOptions, key: Snowflake): boolean;
  hasExactValue(option: DatabaseOptions, key: Snowflake, value: string): boolean;
  add(option: DatabaseOptions, key: Snowflake, value: string): Promise<void>;
  modify(option: DatabaseOptions, key: Snowflake, value: string): Promise<void>;
  delete(option: DatabaseOptions, key: Snowflake): Promise<void>;
}
