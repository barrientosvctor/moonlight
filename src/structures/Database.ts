import { Low } from "lowdb";
import {
  DB_CONTENT,
  DatabaseContent,
  type DatabaseOptions
} from "../types/database.types.js";
import { JSONFile } from "lowdb/node";
import { join } from "node:path";
import { existsSync, mkdirSync, writeFile } from "node:fs";
import { promisify } from "node:util";

const createFile = promisify(writeFile);

export class Database extends Low<DatabaseContent> {
  static #instance: Database;
  private readonly folderPath = join(process.cwd(), "db");

  private constructor() {
    super(new JSONFile(join(process.cwd(), "db", "db.json")), DB_CONTENT);
  }

  public static get instance(): Database {
    if (!Database.#instance) Database.#instance = new Database();
    return Database.#instance;
  }

  public async createDatabaseFile() {
    if (existsSync(this.folderPath)) return;
    mkdirSync(this.folderPath);

    if (existsSync(join(this.folderPath, "db.json"))) return;
    await createFile(
      join(this.folderPath, "db.json"),
      JSON.stringify(DB_CONTENT, undefined, 4)
    );
  }

  public get(option: DatabaseOptions, key: string) {
    const indexData = this.data[option].findIndex(reg => reg.key === key);

    if (indexData === -1) return null;

    return this.data[option][indexData].content;
  }

  public has(option: DatabaseOptions, key: string) {
    return Boolean(this.data[option].find(reg => reg.key === key));
  }

  public hasExactValue(option: DatabaseOptions, key: string, value: string) {
    return Boolean(
      this.data[option].find(reg => reg.key === key && reg.content === value)
    );
  }

  public async add(option: DatabaseOptions, key: string, value: string) {
    await this.update(data => {
      data[option].push({
        key: key,
        content: value
      });
    });
  }

  public async modify(option: DatabaseOptions, key: string, value: string) {
    const indexData = this.data[option].findIndex(reg => reg.key === key);

    if (indexData !== -1) {
      const oldRegisterModified = this.data[option][indexData];
      oldRegisterModified.content = value;

      this.data[option][indexData] = oldRegisterModified;

      await this.write();
    }
  }

  public async delete(option: DatabaseOptions, key: string) {
    const existsRegister = this.data[option].find(reg => reg.key === key);

    if (existsRegister) {
      const filteredDatabase = this.data[option].filter(reg => reg.key !== key);
      if (filteredDatabase) {
        this.data[option] = filteredDatabase;

        await this.write();
      }
    }
  }
}
