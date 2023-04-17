import { writeFile, mkdir, existsSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

const writeLogFile = promisify(writeFile);
const createDir = promisify(mkdir);

export class Logger {
  private static instance: Logger;
  private static path: string = join(process.cwd(), "logs");
  private static file: string = join(Logger.path, "logs.txt");
  private static date: Date = new Date();
  private static datetimeFormatted: string = `[${Logger.date.getDate()}/${Logger.date.getMonth() + 1}/${Logger.date.getFullYear()}] (${Logger.date.toLocaleTimeString()})`

  private constructor() { }

  static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();

    return Logger.instance;
  }

  createDirectory() {
    if (existsSync(Logger.path)) return;

    createDir(Logger.path);
  }

  writeMessage(message: string) {
    writeLogFile(Logger.file, `${Logger.datetimeFormatted} ${message}\n`, { encoding: "utf-8", flag: "a" });
    console.log(`Log enviado: ${message}`);
  }

  writeError(error: Error) {
    writeLogFile(Logger.file, `${Logger.datetimeFormatted} ${error.message}\n`, { encoding: "utf-8", flag: "a" });
    console.error(error);
    console.log(`Error enviado: ${error.message}`);
  }
}
