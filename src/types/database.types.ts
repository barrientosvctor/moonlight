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
